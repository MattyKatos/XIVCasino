const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('banker-balance')
		.setDescription('[BANKER] Check the balance of another wallet.')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('ID of User wallet to check.')
				.setRequired(true)),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const walletID = interaction.options.getString('userid')
		const gil = Number(interaction.options.getString('gil'))

		//Check to see if user is a banker
		try {
			fs.readFileSync('./cache/bankers/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Only bankers can use this command.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] [BANKER COMMAND] BALANCE - 401: User is not a banker.')
			return
		}

		//Check to see if user wallet exists
		try {
			fs.readFileSync('./cache/users/' + walletID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Unable to find target wallet.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] [BANKER COMMAND] BALANCE - 404: User wallet not found.')
			return
		}

		//Return balance
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + walletID + '.json'))
		tax = Math.ceil(Number(userWallet.Balance) * .10)
		availableBalance = Number(userWallet.Balance) - tax
		interaction.reply({ content: '# [BANKER COMMAND] BALANCE\n'+userWallet.DiscordUsername+'\'s current balance is ' + userWallet.Balance + ' gil.\nThey can withdraw ' + availableBalance + ' gil.', ephemeral: false });
		console.log('[' + DiscordUsername + '#' + DiscordID + '] [BANKER COMMAND] BALANCE - 200: Balance returned.')
	}
};