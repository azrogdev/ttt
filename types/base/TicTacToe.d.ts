import { EventEmitter, Events, Player } from '../main.js';
interface GameData {
    started: boolean;
    ended: boolean;
    players: Array<Player>;
    winner: number | null;
    player1: number | null;
    player2: number | null;
    currentPlayer: number | null;
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
    add(ids: number | number[]): void;
    get(id: number): (Player | undefined);
}
interface MoveData {
    x: number;
    y: number;
}
interface MoveScore {
    move: MoveData;
    score: number;
}
declare class TicTacToe extends EventEmitter implements GameOptions {
    bot?: boolean | undefined;
    training?: boolean | undefined;
    difficulty?: number | undefined;
    grid: (string | number)[][][];
    data: GameData;
    constructor(options?: GameOptions);
    private init;
    private flattenGrid;
    get flatGrid(): (string | number)[];
    get players(): GetterPlayer;
    start(): void;
    private nextPlayer;
    private makeMove;
    private undoMove;
    private getAvailableMoves;
    private hasWin;
    private checkDraw;
    private minimax;
    private randomMoves;
    private decideNextMove;
    private botMove;
    private trainingMove;
    get player(): (Player | undefined);
}
export { TicTacToe, GameInstance, GameData, GameOptions, GetterPlayer, MoveData, MoveScore };
