const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Set up your account and open your casino wallet.'),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const userData = '{"DiscordID":"' + DiscordID + '","DiscordUsername":"' + DiscordUsername + '","Balance":0}'

		//Check to see if user already exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
			interaction.reply({ content: 'You\'re already verified!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] REGISTER - 400: User already verified')
			return
		}
		catch (e)
		//Create User Wallet
		{
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', userData)
			interaction.reply({ content: 'Wallet created for ' + DiscordUsername + '!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] REGISTER - 200: User verified')
		}
	},
};