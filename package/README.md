# The TicTacToe Module - @azrogdev/ttt

The TicTacToe module is a versatile implementation of the classic game designed to be integrated into various projects. It offers a range of features to accommodate different play styles, including matches against an AI bot, playing against another player, and a unique training mode to refine your strategies. Whether you're a developer looking to include a fun element in your project or a player seeking a customizable TicTacToe experience, this module is tailored for you.

## Features

- **Versatile Gameplay**: Choose to play against an AI bot, engage in player vs. player battles, or enter the training mode to enhance your strategic skills.
- **Customizable Difficulty**: Tailor the bot's difficulty to match your skill level, making the game as challenging or as accessible as you wish.
- **Training Mode**: Activate training mode to receive guidance on the best moves, improving your game as you play.

## Getting Started

## Prerequisites
| Requirement       | Description                                                                                               |
|-------------------|-----------------------------------------------------------------------------------------------------------|
| Node.js           | Version 14.x or higher required for optimal compatibility with the project's ES6, ES2016, and ESNext features. |



### Installation

Make sure to install the package with :
```bash
npm i @azrogdev/ttt
```
and setup your `package.json` with :
```json
"type": "module"
```
to use ES6 imports.

### Configuration

Start by creating your TicTacToe game instance. You can configure it to face off against the bot, including options for training mode and adjustable difficulty, or set it up for a classic player vs. player matchup.

**To play against the bot with training mode and adjustable difficulty:**

```js
import { TicTacToe } from '@azrogdev/ttt';

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
- A turn-based system is included and automatically activates after `game.start()` is called. It prevents players from taking consecutive turns.
- List of the availables events: `GameStarted`, `GameEnded`, `UpdateGrid`, `Move`, and `TrainingMove`.
## Example
Here's a simple example to demonstrate a player vs. player game setup and execution:
```js
import { TicTacToe, Events } from '@azrogdev/ttt';

const game = new TicTacToe();

game.on(Events.TrainingMove, (data) => {
    const { x, y } = data;
    game.player.move(x, y); // Only available if bot setup on true, and same for training.
})

game.on(Events.GameEnded, (data) => {
    const { winner, state } = data;
    if (state === "draw") return; // Its a draw else state is equal to 'win'
    console.log(winner) // Output: 529658487949754368 (example)
})

game.on(Events.UpdateGrid, (data) => {
    const { grid } = data;
    console.log(grid) // Or whatever to update the display
})
// Adding two players
game.players.add([529658487949754368, 500969672250884106]);
console.log(game.data.started); // Output: false
game.start();
console.log(game.data.started); // Output: true

// Simulating a series of moves
const player1 = game.data.player1;
const player2 = game.data.player2;

game.players.get(player1).move(0, 0);
game.players.get(player2).move(0, 2);
game.players.get(player1).move(1, 0);
game.players.get(player2).move(1, 2);
game.players.get(player1).move(2, 0);
```
### Events

`GameStarted` : is triggered every time a game starts.
```js
game.on(Events.GameStarted, (data) => {
    const { player1, player2, players } = data;

    console.log(player1) // Output: id of the first player.
    console.log(player2) // Output: id of the second player.
    console.log(players) // Output: An array of the players.
})
```
`Move` : is triggered every time a move is made.
```js
game.on(Events.Move, (data) =>  {
    if (!data.sucess) return; // The move is illegal.

    const {x, y} = data;
    console.log(x, y) // Output: the coordinates x and y of the move.
})
```
`TrainingMove` : is triggered every time its your turn and you had the training option enabled.
```js
game.on(Events.TrainingMove, (data) => {
    const {x, y} = data;
    console.log(x, y) // Output: the coordinates x and y of the move.
})
```
`UpdateGrid` : is triggered every time the grid is updated because a movement has been made.
```js
game.on(Events.UpdateGrid, (data) => {
    console.log(data.grid) // Output: the grid updated
})
```
`GameEnded` : is triggered every time a game ends.
```js
game.on(Events.GameEnded, (data) => {
    const { winner, state } = data;

    console.log(winner) // Output: id of the player who won.
    console.log(state) // Output: 'draw' or 'win'
})
```
