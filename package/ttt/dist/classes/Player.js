import { Events } from '../main.js';
class Player {
    constructor(id, instance, options = {}) {
        var _a, _b;
        this.id = id;
        this.instance = instance;
        this.bot = (_a = options.bot) !== null && _a !== void 0 ? _a : false;
        this.symbol = (_b = options.symbol) !== null && _b !== void 0 ? _b : undefined;
    }
    move(x, y, instance) {
        if (!instance.data.started || instance.data.ended)
            return;
        if (x > 2 || x < 0 || y > 2 || y < 0)
            throw new Error('Invalid move');
        if (Number(instance.grid[y][x]) !== 0)
            return instance.emit(Events.MoveMade, { sucess: false });
    }
}
export { Player };
