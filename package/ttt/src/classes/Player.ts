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

   move(x: number, y: number, instance: GameInstance): void {
        if (!instance.data.started || instance.data.ended) return;
        if (x > 2 || x < 0 || y > 2 || y < 0 ) throw new Error('Invalid move');
        if (Number(instance.grid[y][x]) !== 0) return instance.emit(Events.MoveMade, { sucess: false });
   }
}

export { Player, PlayerOptions };
