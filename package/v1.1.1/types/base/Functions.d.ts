import { TicTacToe } from "../main.js";
interface GameBackupPlayer {
    id: number;
    symbol: string | undefined;
    bot: boolean | undefined;
}
interface GameBackupData {
    started: boolean;
    ended: boolean;
    players: Array<GameBackupPlayer>;
    winner: number | null;
    player1: number | null;
    player2: number | null;
    currentPlayer: number | null;
}
interface GameBackup {
    bot: boolean | undefined;
    training: boolean | undefined;
    difficulty: number | undefined;
    grid: (string | number)[];
    data: GameBackupData;
}
declare function validateProperty(value: any, expectedTypes: string | string[], propertyName: string): void;
declare function Save(instance: TicTacToe, toJSON?: boolean): (GameBackup | string | undefined);
declare function Restore(backup: GameBackup | string): TicTacToe;
export { Save, Restore, validateProperty };
