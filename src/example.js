import { TicTacToe } from './classes/TicTacToe.js';

const game = new TicTacToe({
    bot: true,
    difficulty: 3,
});

game.start();
const player1 = game.data.player1;
if (player1 === 666) {
    game.player.move(1, 0);
    game.botMove();
    console.log(game.grid);
} else {
    game.botMove();
    // [...]
}

