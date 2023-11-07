const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('walletdeposit')
		.setDescription('Create a deposit request.')
		.addStringOption(option =>
			option.setName('gil')
				.setDescription('The amount of gil you\'d like to deposit.')
				.setRequired(true)),

	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const gil = Number(interaction.options.getString('gil'))

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Wallet not found!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETDEPOSIT - 401: User does not have a wallet.')
			return
		}

		//Does user have active deposit request?
		try {
			fs.readFileSync('./cache/requests/deposit/' + DiscordID + '.json')
			interaction.reply({ content: 'You already have a deposit request pending.', ephemeral: true });
			return
		}
		catch (e) {}

		//Generate deposit request.
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		depositRequest = '{"DiscordID":"' + DiscordID + '","DiscordUsername":"' + DiscordUsername + '","Deposit":'+Number(gil)+'}'
		fs.writeFileSync('./cache/requests/deposit/' + DiscordID + '.json', depositRequest)
		interaction.reply({ content: 'Created a deposit request for ' + gil + '.\nMake sure you have '+gil+' gil on you in game and a banker will reach out.', ephemeral: true });
		console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETDEPOSIT - 200: Deposit request created.')
	},
};