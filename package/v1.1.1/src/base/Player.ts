import { TicTacToe, GameInstance, Events, validateProperty } from '../main.js';


interface PlayerOptions {
    bot?: boolean;
    symbol?: string;
}

class Player implements PlayerOptions {
    bot?: boolean | undefined;
    symbol?: string | undefined;
    public id: number;
    private instance: GameInstance;

   constructor(id: number, instance: GameInstance, options: PlayerOptions = {}) {
    if (!id || !instance) throw new Error(`Arguments not provided.`);
    if (instance && !(instance instanceof TicTacToe)) throw new Error(`Invalid 'instance' received.`);
    if (options) validateProperty(options, ["object", "undefined"], "options");

        this.id = id;
        this.instance = instance;
        this.bot = options.bot ?? false;
        this.symbol = options.symbol ?? undefined;
        validateProperty(this.bot, ["boolean", "undefined"], "options.bot")
        validateProperty(this.symbol, ["string", "undefined"], "options.symbol");
   }

   move(x: number, y: number): void {
        if (x === undefined || y === undefined) throw new Error(`Arguments not provided.`);
        validateProperty(x, "number", "x");
        validateProperty(y, "number", "y");
        const instance = this.instance;
        if (!instance.data.started || instance.data.ended || instance.data.currentPlayer !== this.id || this.bot) return;
        if (x > 2 || x < 0 || y > 2 || y < 0 ) throw new Error('Invalid move');
        if (Number(instance.grid[y][x]) !== 0) return instance.emit(Events.Move, { success: false });
        return instance.emit(Events.Move, { success: true, x: x, y: y, symbol: this.symbol }); 
   }
}

export { Player, PlayerOptions };