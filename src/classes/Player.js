import { TicTacToe } from './TicTacToe.js';

/**
 * Represents a player of tictactoe.
 * @constructor
 * @param {number} id - The player id.
 * @param {object} instance - The tictactoe instance.
 * @returns {object} the player instancied.
 */

class Player {
    constructor(id, instance) {
        if (!id || isNaN(id)) throw Error("Invalid player id.");
        if (!instance || !instance instanceof TicTacToe) throw Error("Invalid instance.");
        this.id = id;
        this.morpion = instance;

        this.data = instance.data;
        instance.data.players.push(this);
    }

    /**
     * The function to place the player symbol.
     * @constructor
     * @param {number} x - The x coordinates.
     * @param {number} y - The y coordinates.
     * @param {object} instance - The tictactoe instance.
     * @returns {void}
     */

    move(x, y, instance) {

        if (!instance || !instance instanceof TicTacToe) throw Error("Invalid instance.");
        this.data = instance.data;
        if (!this.data.started || this.data.ended) return;
        const symbol = this.data.players.find(p => p.id === this.id).symbol;
        if (!symbol) throw new Error("Something wrong with the symbol");
        instance.place(x, y, symbol);
    }
}

export { Player };
