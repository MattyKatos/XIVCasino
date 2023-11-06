const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check the balance of your casino wallet.'),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const userData = '{"DiscordID":"' + DiscordID + '","DiscordUsername":"' + DiscordUsername + '","Balance":"0"}'

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Wallet not found!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] BALANCE - 401: User does not have a wallet.')
			return
		}

		//Return balance
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		{
			interaction.reply({ content: 'Your current balance is ' + userWallet.Balance + ' gil.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] BALANCE - 200: Balance returned.')
		}
	},
};