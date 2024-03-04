import { EventEmitter, Events, Player } from '../main.js';
interface GameData {
    started: boolean;
    ended: boolean;
    players: Array<Player>;
    winner: number | null;
    player1: number | null;
    player2: number | null;
}
interface GameInstance {
    data: GameData;
    bot?: boolean;
    training?: boolean;
    difficulty?: number;
    grid: (string | number)[][][];
    on(eventName: Events, listener: (...args: any[]) => void): void;
    emit(eventName: Events, ...args: any[]): void;
}
interface GameOptions {
    bot?: boolean;
    training?: boolean;
    difficulty?: number;
}
interface GetterPlayer {
    cache: Array<Player>;
    add(ids: number | number[], force: boolean): void;
    get(id: number): (Player | undefined);
}
declare class TicTacToe extends EventEmitter implements GameOptions {
    bot?: boolean | undefined;
    training?: boolean | undefined;
    difficulty?: number | undefined;
    grid: (string | number)[][][];
    data: GameData;
    constructor(options?: GameOptions);
    private init;
    get players(): GetterPlayer;
}
export { TicTacToe, GameInstance, GameData, GameOptions, GetterPlayer };
