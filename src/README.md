# TicTacToe Game

Here is the main part of the javascript code, you can easily use the project in your best websites, applications or bots with using the files under `/classes/` and a web example in `/web-js/`.
But if you're looking for a more complete and structured code, you can follow the path : `../../package/` and use the TypeScript code.

### Configuration
Before starting, make sure to setup your `package.json` with :
```json
"type": "module"
```
to use ES6 imports (else replace `import {} from 'file'` by `const {} = require('file')`).

Start by creating your TicTacToe game instance. You can configure it to face off against the bot, including options for training mode and adjustable difficulty, or set it up for a classic player vs. player matchup.

**To play against the bot with training mode and adjustable difficulty:**

```js
import { TicTacToe } from 'file'; // If all the necessary code is in this file remove this line.

const game = new TicTacToe({
    bot: true,
    training: true, // Enable training mode for suggestions on the best moves
    difficulty: 5, // Set the bot's difficulty level (1-5)
});
```
**For a player vs. player setup:**
```js
const game = new TicTacToe();
```
### Starting the Game
Initiating a game varies slightly depending on whether you're playing against the bot or another player.

**Against the bot:**

Players are automatically added, and you can start the game directly.
```js
game.start();
```
**In player vs player mode:**

You must add the players manually before starting the game.
```js
game.players.add([529658487949754368, 500969672250884106]); // Replace with actual player ids.
game.start();
```
### Making a Move
The process of making a move is termed as 'move' because it signifies the action of placing your symbol on the board. The method varies slightly depending on your game mode.

**Against the bot:**
```js
game.player.move(0, 0); // To place your symbol at position (0,0)
```
**In player vs player mode:**
```js
game.players.get('playerId').move(0, 0); // Replace 'playerId' with the current player id.
```
Game Conclusion
The game concludes when `game.data.ended` is set to true. You can check `game.data.winner` to identify the winner's player id. Note:

- Against the bot, player IDs are predefined as **666** for the human and **42** for the bot.
- `game.data.winner` will be null in the event of a draw.
## Example
Here's a simple example to demonstrate a player vs. player game setup and execution:
```js
import { TicTacToe } from 'file';

const game = new TicTacToe();

// Adding two players
game.players.add([529658487949754368, 500969672250884106]);
console.log(game.data.started); // Output: false
game.start();
console.log(game.data.started); // Output: true

// Simulating a series of moves
game.players.get(529658487949754368).move(0, 0); // You can also get the player1 with game.players.get(game.data.player1) and the player2 with game.players.get(game.data.player2)
game.players.get(500969672250884106).move(0, 2);
game.players.get(529658487949754368).move(1, 0);
game.players.get(500969672250884106).move(1, 2);
game.players.get(529658487949754368).move(2, 0);

// Checking game end and winner
console.log(game.data.ended); // Output: true
console.log(game.data.winner); // Output: 529658487949754368
```
