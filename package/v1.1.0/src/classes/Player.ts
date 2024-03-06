import { TicTacToe, GameInstance, Events } from '../main.js';


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
        this.id = id;
        this.instance = instance;
        this.bot = options.bot ?? false;
        this.symbol = options.symbol ?? undefined;
   }

   move(x: number, y: number): void {
          const instance = this.instance;
        if (!instance.data.started || instance.data.ended || instance.data.currentPlayer !== this.id || this.bot) return;
        if (x > 2 || x < 0 || y > 2 || y < 0 ) throw new Error('Invalid move');
        if (Number(instance.grid[y][x]) !== 0) return instance.emit(Events.Move, { success: false });
        return instance.emit(Events.Move, { success: true, x: x, y: y, symbol: this.symbol }); 
   }
}

export { Player, PlayerOptions };