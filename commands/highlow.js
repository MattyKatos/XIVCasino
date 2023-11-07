const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

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
		const start = new ButtonBuilder()
			.setCustomId('start')
			.setLabel('Start')
			.setStyle(ButtonStyle.Success);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);

		const confirmrow = new ActionRowBuilder()
			.addComponents(start, cancel);

		const high = new ButtonBuilder()
			.setCustomId('high')
			.setLabel('High')
			.setStyle(ButtonStyle.Secondary);

		const low = new ButtonBuilder()
			.setCustomId('low')
			.setLabel('Low')
			.setStyle(ButtonStyle.Secondary);

		const betrow = new ActionRowBuilder()
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

		//Define currentBalance
		var currentBalance = 0

		//Can user cover bet?
		userWallet = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))
		userBalance = Number(userWallet.Balance)
		if (bet > userBalance) {
			interaction.reply({ content: 'You can\'t bet more gil then you have in your wallet!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 401: User can\'t cover bet.')
			return
		} else { }

		//Update currentBalance from user wallet.
		currentBalance = userBalance

		//Generate numbers for High/Low
		num1 = Math.floor(Math.random() *(13 - 1 + 1) + 1)
		suit1 = Math.floor(Math.random() *(4 - 1 + 1) + 1)
		num2 = Math.floor(Math.random() *(13 - 1 + 1) + 1)
		suit2 = Math.floor(Math.random() *(4 - 1 + 1) + 1)

		//Card Names
		function cardName(card) {
			switch (card) {
				case 1:
					return "an ace"
					break;
				case 2:
					return "a two"
					break;
				case 3:
					return "a three"
					break;
				case 4:
					return "a four"
					break;
				case 5:
					return "a five"
					break;
				case 6:
					return "a six"
					break;
				case 7:
					return "a seven"
					break;
				case 8:
					return "an eight"
					break;
				case 9:
					return "a nine"
					break;
				case 10:
					return "a ten"
					break;
				case 11:
					return "a jack"
					break;
				case 12:
					return "a queen"
					break;
				case 13:
					return "a king"
					break;
			}
		}
		function suitName(suit) {
			switch (suit) {
				case 1:
					return " of hearts"
					break;
				case 2:
					return " of diamonds"
					break;
				case 3:
					return " of clubs"
					break;
				case 4:
					return " of spades"
					break;
			}
		}

		//WON / LOST / TIED
		async function betwon(bet, card1, card2) {
			newBalance = Number(currentBalance) + Number(bet) + Number(bet * 0.1)
			newUserWallet = '{"DiscordID":"' + userWallet.DiscordID + '","DiscordUsername":"' + userWallet.DiscordUsername + '","Balance":' + newBalance + '}'
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', newUserWallet)
			await interaction.editReply({ content: 'Your first card is a ' + cardName(card1) + suitName(suit1) + '\nYour second card was a ' + cardName(card2) + suitName(suit2) + '.\nYou won ' + Number(bet * 0.1) + ' gil!\nYour new balance is ' + newBalance + ' gil.', components: [] });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 200: User won.')
			return
		}
		async function bettied(bet, card1, card2) {
			newBalance = Number(currentBalance) + Number(bet)
			newUserWallet = '{"DiscordID":"' + userWallet.DiscordID + '","DiscordUsername":"' + userWallet.DiscordUsername + '","Balance":' + newBalance + '}'
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', newUserWallet)
			await interaction.editReply({ content: 'Your first card is a ' + cardName(card1) + suitName(suit1) + '\nYour second card was a ' + cardName(card2) + suitName(suit2) + '.\nYou tied.\nYour new balance is ' + newBalance + ' gil.', components: [] });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 200: User tied.')
			return
		}
		async function betlost(bet, card1, card2) {
			newBalance = Number(currentBalance)
			newUserWallet = '{"DiscordID":"' + userWallet.DiscordID + '","DiscordUsername":"' + userWallet.DiscordUsername + '","Balance":' + newBalance + '}'
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', newUserWallet)
			await interaction.editReply({ content: 'Your first card is a ' + cardName(card1) + suitName(suit1) + '\nYour second card was a ' + cardName(card2) + suitName(suit2) + '.\nYou lost ' + bet + ' gil!\nYour new balance is ' + newBalance + ' gil.', components: [] });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] HIGHLOW - 200: User lost.')
			return
		}

		//Confirm Bet
		try {
			var response = await interaction.reply({
				content: `Are you you ready to bet ` + bet + ' on a game of High/Low?',
				components: [confirmrow],
				ephemeral: true,
			});
			//Await responce
			var confirmation = await response.awaitMessageComponent({ time: 600_000 });

			//If Start, take bet money away and send first card.
			if (confirmation.customId === 'start') {
				currentBalance = Number(currentBalance) - Number(bet)
				newUserWallet = '{"DiscordID":"' + userWallet.DiscordID + '","DiscordUsername":"' + userWallet.DiscordUsername + '","Balance":' + currentBalance + '}'
				fs.writeFileSync('./cache/users/' + DiscordID + '.json', newUserWallet)
				var response = await confirmation.update({ content: 'Your first card is a ' + cardName(num1) + suitName(suit1), components: [betrow], ephemeral: true });
			}

			// If Cancel, end.
			else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Canceled.', components: [], ephemeral: true });
				return
			}


			var confirmation = await response.awaitMessageComponent({ time: 600_000 });

			if (confirmation.customId === 'high') {
				if (num1 < num2) { betwon(bet, num1, num2) }
				else if (num1 > num2) { betlost(bet, num1, num2) }
				else { bettied(bet, num1, num2) }
			}
			else if (confirmation.customId === 'low') {
				if (num1 > num2) { betwon(bet, num1, num2) }
				else if (num1 < num2) { betlost(bet, num1, num2) }
				else { bettied(bet, num1, num2) }
			}
		} catch (e) {
			console.log(e)
			await interaction.editReply({ content: 'Request timed out.', components: [], ephemeral: true });
		}
	},
};