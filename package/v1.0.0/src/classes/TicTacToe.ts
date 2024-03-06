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
        this.data = { winner: null, player1: null, player2: null, players: [], started: false, ended: false , currentPlayer: null }
        this.grid = this.init();
    }
    private init(): number[][][] {
        const structure: number[][][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Array.from({ length: 1 }, () => 0)));
        return structure;
    }
    public get players(): GetterPlayer {
        const instance = this;
        return {
            add: (ids: number | number[]): void => {
                if (instance.data.started || instance.data.ended) return;
                if (instance.bot) return;

                const addPlayer = (id: number): void => {
                    if (instance.data.players.includes(new Player(id, instance)) || instance.data.players.length === 2) return;
                    const player = new Player(id, instance);
                    instance.data.players.push(player);
                }

                if (Array.isArray(ids)) {
                    ids.forEach((id) => addPlayer(id));
                } else {
                    addPlayer(ids);
                }
            },
            get: (id: number) => {
                const player = instance.data.players.find(p => p.id === id);
                if (!player) return undefined;
                return player;
            },
            get cache(): Array<Player> {
                return instance.data.players;
            }
        }
    }
    public start(): void {
        if (!this.bot && this.data.players.length !== 2) return;
        const randomNumber = Math.floor(Math.random() * 2);
        const firstSymbol = randomNumber === 0 ? "x" : "o";
        const secondSymbol = firstSymbol === "x" ? "o" : "x";
        if (this.bot) {
            const players = [];
            players.push(new Player(666, this, { symbol: firstSymbol }));
            players.push(new Player(42, this, { symbol: secondSymbol, bot: true }));
            this.data.players = players;
        } else {
            this.data.players[0].symbol = firstSymbol;
            this.data.players[1].symbol = secondSymbol;
        }

        this.data.started = true;
        const player1 = this.data.players.find(player => player.symbol === firstSymbol);
        if (!player1) throw new Error('Something wrong while setup the player 1.')
        const player2 = this.data.players.find(player => player.symbol === secondSymbol);
        if (!player2) throw new Error('Something wrong while setup the player 2.')
        this.data.player1 = player1.id;
        this.data.player2 = player2.id;
        this.data.currentPlayer = player1.id;
        if(player1.id === 666 && this.bot && this.training) {
            this.trainingMove();
        }
        this.emit(Events.GameStarted, ({ player1: player1, player2: player2, players: this.data.players }));
        this.on(Events.Move, (data) => {
            if (data.sucess) {
                this.grid[data.y][data.x] = data.symbol;
                this.emit(Events.UpdateGrid, { grid: this.grid });
                if (this.hasWin(String(data.symbol), this.grid)) {
                    this.data.winner = this.data.currentPlayer;
                    this.data.ended = true;
                    this.emit(Events.GameEnded, { state: "win", winner: this.data.winner });
                } else if (this.checkDraw(this.grid)) {
                    this.data.ended = true;
                    this.emit(Events.GameEnded, { state: "draw", winner: null });
                } else {
                    this.nextPlayer();
                    if (this.bot) this.botMove();
                    
                }
            }
        })
    }
    private nextPlayer(): void {
        const currentPlayerId = this.data.currentPlayer;
        const player = this.data.players.find(player => player.id !== currentPlayerId);
        if (!player) throw new Error('Something wrong while searching the next player');
        this.data.currentPlayer = player.id;
    }
    private makeMove(grid: (string | number)[][][], move: MoveData, symbol: string): void {
        const { x, y } = move;
        grid[y][x][0] = symbol;
    }
    private undoMove(grid: (string | number)[][][], move: MoveData): void {
        const { x, y } = move;
        grid[y][x][0] = 0;
    }
    private getAvailableMoves(grid: (string | number)[][][]): Array<MoveData> {
        let moves = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j][0] === 0) {
                    moves.push({ x: j, y: i });
                }
            }
        }
        return moves;
    }
    private hasWin(symbol: string, originalGrid: (string | number)[][][]): boolean {
        const grid = JSON.parse(JSON.stringify(originalGrid));
        const diagonalFilled = () => {
            let diagonal1 = true, diagonal2 = true;
            for (let i = 0; i < 3; i++) {
                diagonal1 = diagonal1 && grid[i][i][0] === symbol;
                diagonal2 = diagonal2 && grid[2 - i][i][0] === symbol;
            }
            return diagonal1 || diagonal2;
        };
        const lineOrColumnFilled = () => {
            for (let i = 0; i < 3; i++) {
                let rowFilled = true, colFilled = true;
                for (let j = 0; j < 3; j++) {
                    rowFilled = rowFilled && grid[i][j][0] === symbol;
                    colFilled = colFilled && grid[j][i][0] === symbol;
                }
                if (rowFilled || colFilled) return true;
            }
            return false;
        };

        return diagonalFilled() || lineOrColumnFilled();
    }
    private checkDraw(originalGrid: (string | number)[][][]): boolean {
        const grid = JSON.parse(JSON.stringify(originalGrid))
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x][0] === 0) {
                    return false;
                }
            }
        }
        const symbol1 = this.data.players[0].symbol;
        const symbol2 = this.data.players[1].symbol;
        if (!symbol1 || !symbol2) throw new Error('Something wrongs with the symbols.');
        if (this.hasWin(symbol1, grid) || this.hasWin(symbol2, grid)) {
            return false;
        }
        return true;
    }
    private minimax(grid: (string | number)[][][], depth: number, alpha: number, beta: number, isMaximizing: boolean, botSymbol: string, playerSymbol: string): number {
        if (this.hasWin(botSymbol, grid)) {
            return 10 - depth;
        } else if (this.hasWin(playerSymbol, grid)) {
            return depth - 10;
        } else if (this.checkDraw(grid)) {
            return 0;
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let move of this.getAvailableMoves(grid)) {
                this.makeMove(grid, move, botSymbol);
                let score = this.minimax(grid, depth + 1, alpha, beta, false, botSymbol, playerSymbol);
                this.undoMove(grid, move);
                maxEval = Math.max(score, maxEval);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        } else {
            let minEval = +Infinity;
            for (let move of this.getAvailableMoves(grid)) {
                this.makeMove(grid, move, playerSymbol);
                let score = this.minimax(grid, depth + 1, alpha, beta, true, botSymbol, playerSymbol);
                this.undoMove(grid, move);
                minEval = Math.min(score, minEval);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }
    private randomMoves(arr: Array<MoveScore>, difficulty: (number | undefined)): MoveScore {
        if (!Array.isArray(arr) || arr.length < 1 || difficulty && isNaN(difficulty)) throw new Error('Invalid difficulty passed.')
        const x = 5;
        var y = difficulty;
        if (!y) y = 5;
        if (arr.length === 1) {
            return arr[0];
        }
        const best = arr[0];
        const worses = arr.splice(1, arr.length - 1);
        const i = Math.floor(Math.random() * worses.length);
        const worse = worses[i]
        const rdm = Math.floor(Math.random() * x) + 1;
        if (rdm <= y) {
            return best;
        } else {
            return worse;
        }
    }
    private decideNextMove(grid: (string | number)[][][], difficulty: (number | undefined), symbol: string, playerSymbol: string): MoveData {
        let movesScores = [];
        const moves = this.getAvailableMoves(grid);

        for (const move of moves) {
            this.makeMove(grid, move, symbol);
            let score = this.minimax(grid, 0, -Infinity, Infinity, false, symbol, playerSymbol);
            this.undoMove(grid, move);
            movesScores.push({ move, score });
        }

        movesScores.sort((a, b) => b.score - a.score);
        const selectedMove = this.randomMoves(movesScores, difficulty)
        return selectedMove.move;
    }
    private botMove(): void {
        if (!this.data.started || this.data.ended || !this.bot) return;
        if (this.data.currentPlayer !== 42) return;
        const bot = this.data.players.find(p => p.id === 42);
        const symbol = bot ? bot.symbol : null;
        if (!symbol) throw new Error("There is an issue with the bot symbol.");
        const player = this.data.players.find(p => p.id === 666);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol) throw new Error("There is an issue with the player's symbol.");
        const nextMove = this.decideNextMove(this.grid, this.difficulty, symbol, playerSymbol);
        if (nextMove) {
            this.makeMove(this.grid, nextMove, symbol);
            this.emit(Events.UpdateGrid, { grid: this.grid });
            if (this.checkDraw(this.grid)) {
                this.data.ended = true;
                return this.emit(Events.GameEnded, { state: "draw", winner: null });
            } else if (this.hasWin(symbol, this.grid)) {
                this.data.ended = true;
                this.data.winner = 42;
                return this.emit(Events.GameEnded, { state: "win", winner: this.data.winner });
            }
            this.nextPlayer();
            if (this.training) {
                this.trainingMove();
            }
        }
    }
    private trainingMove(): any {
        if (!this.data.started || this.data.ended || !this.bot) return;
        if (this.data.currentPlayer !== 42) return;
        const player = this.data.players.find(player => player.id === 666);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol) throw new Error("Something wrong with the player's symbol.");
        const bot = this.data.players.find(player => player.id === 42);
        const botSymbol = bot ? bot.symbol : null;
        if (!botSymbol) throw new Error("Something wrong with the bot symbol.");
        const nextMove = this.decideNextMove(this.grid, 5, playerSymbol, botSymbol);
        if (nextMove) {
            return this.emit(Events.TrainingMove, { x: nextMove.x, y: nextMove.y })
        }
    }
    public get player(): (Player | undefined) {
        if (!this.bot || this.bot && !this.data.started) return undefined;
        const player = this.data.players.find(player => player.id === 666)
        if (!player) throw new Error("Something wrong while getting the player.")
        return player;
    }
}

export { TicTacToe, GameInstance, GameData, GameOptions, GetterPlayer, MoveData, MoveScore };
