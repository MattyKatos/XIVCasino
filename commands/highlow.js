const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

//Adjust Money
function adjustBalance(){
	
}

module.exports = {

	data: new SlashCommandBuilder()
		.setName('highlow')
		.setDescription('Bet on whether the second card to be drawn from the deck will be higher or lower than the first.')
		.addStringOption(option =>
			option.setName('bet')
				.setDescription('The amount of gil you\'d like to bet.')
				.setRequired(true)),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const bet = Number(interaction.options.getString('bet'))

		//Define Buttons and rows
		const high = new ButtonBuilder()
			.setCustomId('high')
			.setLabel('High')
			.setStyle(ButtonStyle.Secondary);

		const low = new ButtonBuilder()
			.setCustomId('low')
			.setLabel('Low')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(high, low);

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Wallet not found!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 401: User does not have a wallet.')
			return
		}

		//Can user cover bet?
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		userBalance = Number(userWallet.Balance)
		if (bet > userBalance) {
			interaction.reply({ content: 'You can\'t bet more gil then you have in your wallet!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 401: User can\'t cover bet.')
			return
		}

		//Gamble
		num1 = Math.floor(Math.random() * 11)
		num2 = Math.floor(Math.random() * 11)
		newBalance = Number(userWallet.Balance) - bet
		
		interaction.reply({ content: 'Your current balance is ' + userWallet.Balance + ' gil.', ephemeral: true });
		console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 200: User can\'t afford the bet.')
	},
};