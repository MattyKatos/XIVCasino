# XIV Casino
A Discord bot that allows you to gamble with gil from FFXIV.

# Commands
A list of commands for the discord bot.


## User Commands
Commands useable by any user.

### Setup
These commands are allowed pior to using the register command.
#### /register
Creates a wallet and links it to your Discord account.

### Wallet
These commands are used to manipulate a user wallet.
#### /wallet
Returns user's current wallet balance. Returns maximum withdraw after calculating 10% fee.
#### /wallet-deposit (amount)
Creates a deposit request
#### /wallet-withdraw (amount)
Creates a withdraw request


## Banker Commands
Commands that require elevation to run.

### Monitoring
These commands allow bankers to see things a normal user can't see.
#### /banker-balance (userID)
Shows the balance of the wallet of target (userID)

### Request based
These commands are used to approve, deny, and process existing player requests to handle deposits and withdraws with minimal work.
#### WIP

### Manual
These commands are used to manually add or remove funds from a user's wallet.
#### /banker-add (userID) (amount)
Gives (amount) of gil to the wallet of target (userID)
#### /banker-remove (userID) (amount)
Removes (amount) of gil from the wallet of target (userID)
