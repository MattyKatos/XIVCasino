const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('wallet-withdraw')
		.setDescription('Create a withdraw request.')
		.addStringOption(option =>
			option.setName('gil')
				.setDescription('The amount of gil you\'d like to withdraw.')
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
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETWITHDRAW - 401: User does not have a wallet.')
			return
		}

		//Can user cover withdraw?
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		userBalance = Number(userWallet.Balance)
		tax = Math.ceil(Number(userWallet.Balance) * .10)
		availableBalance = userBalance - tax
		withdrawTax = Math.ceil(Number(gil) * .10)
		withdrawTotal = Number(gil) + withdrawTax

		if (gil > availableBalance) {
			interaction.reply({ content: 'You can\'t withdraw more gil then you have in your wallet!\nYour max available balance is '+availableBalance+' after withdraw fees.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETWITHDRAW - 401: User can\'t cover withdraw.')
			return
		} else {}

		//Does user have active withdraw request?
		try {
			fs.readFileSync('./cache/requests/withdraw/' + DiscordID + '.json')
			interaction.reply({ content: 'You already have a withdraw request pending.', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETWITHDRAW - 401: User alread has a withdraw request.')
			return
		}
		catch (e) {}

		//Generate withdraw request.
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		withdrawRequest = '{"DiscordID":"' + DiscordID + '","DiscordUsername":"' + DiscordUsername + '","Withdraw":'+Number(gil)+',"Fee":'+withdrawTax+',"Total":'+withdrawTotal+'}'
		fs.writeFileSync('./cache/requests/withdraw/' + DiscordID + '.json', withdrawRequest)
		interaction.reply({ content: 'Created a withdraw request for ' + gil + '.\nMake sure to keep your balance above '+withdrawTotal+' gil or your withdraw request will fail.', ephemeral: true });
		console.log('[' + DiscordUsername + '#' + DiscordID + '] WALLETWITHDRAW - 200: Withdraw request created.')
	},
};