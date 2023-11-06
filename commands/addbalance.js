const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('addbalance')
		.setDescription('Add gil to a player wallet.')
		.addStringOption(option =>
			option.setName('userid')
			.setDescription('ID of User wallet to modify.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('gil')
			.setDescription('amount of gil to add.')
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
			console.log('[' + DiscordUsername + '#' + DiscordID + '] ADDBALANCE - 401: User is not a banker.')
			return
		}

		//Check to see if user wallet exists
		try {
			fs.readFileSync('./cache/users/' + walletID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'Unable to find target wallet.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] ADDBALANCE - 404: User wallet not found.')
			return
		}

		//Update balance
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + walletID + '.json'))
		newBalance = Number(userWallet.Balance) + gil
		newUserWallet = '{"DiscordID":"' + userWallet.DiscordID + '","DiscordUsername":"' + userWallet.DiscordUsername + '","Balance":'+newBalance+'}'
		fs.writeFileSync('./cache/users/' + DiscordID + '.json', newUserWallet)
		interaction.reply({ content: 'Balance Updated!', ephemeral: true });
		console.log('[' + DiscordUsername + '#' + DiscordID + '] ADDBALANCE - 200: Balance adjusted.')
	},
};