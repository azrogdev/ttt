import { TicTacToe, Events, validateProperty } from '../main.js';
class Player {
    constructor(id, instance, options = {}) {
        var _a, _b;
        if (!id || !instance)
            throw new Error(`Arguments not provided.`);
        if (instance && !(instance instanceof TicTacToe))
            throw new Error(`Invalid 'instance' received.`);
        if (options)
            validateProperty(options, ["object", "undefined"], "options");
        this.id = id;
        this.instance = instance;
        this.bot = (_a = options.bot) !== null && _a !== void 0 ? _a : false;
        this.symbol = (_b = options.symbol) !== null && _b !== void 0 ? _b : undefined;
        validateProperty(this.bot, ["boolean", "undefined"], "options.bot");
        validateProperty(this.symbol, ["string", "undefined"], "options.symbol");
    }
    move(x, y) {
        if (x === undefined || y === undefined)
            throw new Error(`Arguments not provided.`);
        validateProperty(x, "number", "x");
        validateProperty(y, "number", "y");
        const instance = this.instance;
        if (!instance.data.started || instance.data.ended || instance.data.currentPlayer !== this.id || this.bot)
            return;
        if (x > 2 || x < 0 || y > 2 || y < 0)
            throw new Error('Invalid move');
        if (Number(instance.grid[y][x]) !== 0)
            return instance.emit(Events.Move, { success: false });
        return instance.emit(Events.Move, { success: true, x: x, y: y, symbol: this.symbol });
    }
}
export { Player };
