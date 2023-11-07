const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('wallet')
		.setDescription('Check the balance of your casino wallet.'),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Wallet not found!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLET - 401: User does not have a wallet.')
			return
		}

		//Return balance
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		tax = Math.ceil(Number(userWallet.Balance) * .10)
		availableBalance = Number(userWallet.Balance) - tax
		{
			interaction.reply({ content: 'Your current balance is ' + userWallet.Balance + ' gil.\nYou can withdraw '+availableBalance+' gil.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLET - 200: Balance returned.')
		}
	},
};