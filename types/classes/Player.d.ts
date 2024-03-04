import { GameInstance } from '../main.js';
interface PlayerOptions {
    bot?: boolean;
    symbol?: string;
}
declare class Player implements PlayerOptions {
    bot?: boolean | undefined;
    symbol?: string | undefined;
    id: number;
    private instance;
    constructor(id: number, instance: GameInstance, options?: PlayerOptions);
    move(x: number, y: number, instance: GameInstance): void;
}
export { Player, PlayerOptions };
