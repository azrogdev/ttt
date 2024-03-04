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

class TicTacToe extends EventEmitter implements GameOptions {
    bot?: boolean | undefined;
    training?: boolean | undefined;
    difficulty?: number | undefined;
    grid: (string | number)[][][];
    data: GameData;

    constructor(options: GameOptions = {}) {
        super();
        this.bot = options.bot ?? false;
        this.training = options.training ?? false;
        this.difficulty = options.difficulty ?? 5;
        this.data = { winner: null, player1: null, player2: null, players: [], started: false, ended: false }
        this.grid = this.init();
        this.emit(Events.init, ({content: "test"}))
    }
    private init(): number[][][] {
        this.on(Events.init, (data) => {
            console.log(data)
        })
        const structure: number[][][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Array.from({ length: 1 }, () => 0)));
        return structure;
    }
    public get players(): GetterPlayer {
        const instance = this;
        return {
            add: (ids: number | number[], force: boolean = false): void => {
                if ( instance.data.started || instance.data.ended ) return;
                if ( instance.bot && !force) return;

                const addPlayer = (id: number): void => {
                    if (instance.data.players.includes(new Player(id, instance)) || instance.data.players.length === 2) return;
                    const player = new Player(id, instance)
                    instance.data.players.push(player)
                }

                if (Array.isArray(ids)) {
                    ids.forEach((id) => addPlayer(id));
                } else {
                    addPlayer(ids);
                }
            },
            get: (id: number) => {
                const player = instance.data.players.find(p => p.id === id)
                if (!player) return undefined;
                return player;
            },
            get cache(): Array<Player> {
                return instance.data.players;
            }
        }
    }
}


export { TicTacToe, GameInstance, GameData, GameOptions, GetterPlayer };
