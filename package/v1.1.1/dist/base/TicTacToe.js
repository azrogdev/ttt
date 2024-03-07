import { EventEmitter, Events, Player, validateProperty } from '../main.js';
class TicTacToe extends EventEmitter {
    constructor(options = {}) {
        var _a, _b, _c;
        super();
        this.bot = (_a = options.bot) !== null && _a !== void 0 ? _a : false;
        validateProperty(options.bot, ["boolean", "undefined"], "options.bot");
        this.training = (_b = options.training) !== null && _b !== void 0 ? _b : false;
        validateProperty(options.training, ["boolean", "undefined"], "options.training");
        this.difficulty = (_c = options.difficulty) !== null && _c !== void 0 ? _c : 5;
        validateProperty(options.difficulty, ["number", "undefined"], "options.difficulty");
        this.data = { winner: null, player1: null, player2: null, players: [], started: false, ended: false, currentPlayer: null };
        this.grid = this.init();
    }
    init() {
        const structure = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Array.from({ length: 1 }, () => 0)));
        return structure;
    }
    flattenGrid(grid) {
        let array = [];
        grid.forEach((element) => {
            if (Array.isArray(element)) {
                array = [...array, ...this.flattenGrid(element)];
            }
            else
                array.push(element);
        });
        return array;
    }
    get flatGrid() {
        return this.flattenGrid(this.grid);
    }
    get players() {
        const instance = this;
        return {
            add: (ids) => {
                if (instance.data.started || instance.data.ended)
                    return;
                if (instance.bot)
                    return;
                const addPlayer = (id) => {
                    validateProperty(id, "number", "id");
                    if (instance.data.players.includes(new Player(id, instance)) || instance.data.players.length === 2)
                        return;
                    const player = new Player(id, instance);
                    instance.data.players.push(player);
                };
                if (Array.isArray(ids)) {
                    ids.forEach((id) => addPlayer(id));
                }
                else {
                    addPlayer(ids);
                }
            },
            get: (id) => {
                validateProperty(id, "number", "id");
                const player = instance.data.players.find(p => p.id === id);
                if (!player)
                    return undefined;
                return player;
            },
            get cache() {
                return instance.data.players;
            }
        };
    }
    start() {
        if (!this.bot && this.data.players.length !== 2)
            return;
        const randomNumber = Math.floor(Math.random() * 2);
        const firstSymbol = randomNumber === 0 ? "x" : "o";
        const secondSymbol = firstSymbol === "x" ? "o" : "x";
        if (this.bot) {
            const players = [];
            players.push(new Player(666, this, { symbol: firstSymbol }));
            players.push(new Player(42, this, { symbol: secondSymbol, bot: true }));
            this.data.players = players;
        }
        else {
            this.data.players[0].symbol = firstSymbol;
            this.data.players[1].symbol = secondSymbol;
        }
        this.data.started = true;
        const player1 = this.data.players.find(player => player.symbol === firstSymbol);
        if (!player1)
            throw new Error('Something wrong while setup the player 1.');
        const player2 = this.data.players.find(player => player.symbol === secondSymbol);
        if (!player2)
            throw new Error('Something wrong while setup the player 2.');
        const firstPlayer = this.data.players.find(player => player.symbol === "x");
        if (!firstPlayer)
            throw new Error('Something wrong with the firstPlayer');
        const secondPlayer = this.data.players.find(player => player.symbol === "o");
        if (!secondPlayer)
            throw new Error('Something wrong with the secondPlayer');
        this.data.player1 = firstPlayer.id;
        this.data.player2 = secondPlayer.id;
        this.data.currentPlayer = firstPlayer.id;
        if (this.bot && firstPlayer.id === 42)
            this.botMove();
        if (this.bot && this.training && firstPlayer.id === 666)
            this.trainingMove();
        this.emit(Events.GameStarted, ({ player1: firstPlayer, player2: secondPlayer, players: this.data.players }));
        this.on(Events.Move, (data) => {
            validateProperty(data, "object", "data");
            if (data.success) {
                this.grid[data.y][data.x] = data.symbol;
                this.emit(Events.UpdateGrid, { grid: this.grid });
                if (this.hasWin(String(data.symbol), this.grid)) {
                    this.data.winner = this.data.currentPlayer;
                    this.data.ended = true;
                    this.emit(Events.GameEnded, { state: "win", winner: this.data.winner });
                }
                else if (this.checkDraw(this.grid)) {
                    this.data.ended = true;
                    this.emit(Events.GameEnded, { state: "draw", winner: null });
                }
                else {
                    this.nextPlayer();
                    if (this.bot)
                        this.botMove();
                }
            }
        });
    }
    nextPlayer() {
        const currentPlayerId = this.data.currentPlayer;
        const player = this.data.players.find(player => player.id !== currentPlayerId);
        if (!player)
            throw new Error('Something wrong while searching the next player');
        this.data.currentPlayer = player.id;
    }
    makeMove(grid, move, symbol) {
        const { x, y } = move;
        grid[y][x][0] = symbol;
    }
    undoMove(grid, move) {
        const { x, y } = move;
        grid[y][x][0] = 0;
    }
    getAvailableMoves(grid) {
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
    hasWin(symbol, originalGrid) {
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
                if (rowFilled || colFilled)
                    return true;
            }
            return false;
        };
        return diagonalFilled() || lineOrColumnFilled();
    }
    checkDraw(originalGrid) {
        const grid = JSON.parse(JSON.stringify(originalGrid));
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x][0] === 0) {
                    return false;
                }
            }
        }
        const symbol1 = this.data.players[0].symbol;
        const symbol2 = this.data.players[1].symbol;
        if (!symbol1 || !symbol2)
            throw new Error('Something wrongs with the symbols.');
        if (this.hasWin(symbol1, grid) || this.hasWin(symbol2, grid)) {
            return false;
        }
        return true;
    }
    minimax(grid, depth, alpha, beta, isMaximizing, botSymbol, playerSymbol) {
        if (this.hasWin(botSymbol, grid)) {
            return 10 - depth;
        }
        else if (this.hasWin(playerSymbol, grid)) {
            return depth - 10;
        }
        else if (this.checkDraw(grid)) {
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
        }
        else {
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
    randomMoves(arr, difficulty) {
        if (!Array.isArray(arr) || arr.length < 1 || difficulty && isNaN(difficulty))
            throw new Error('Invalid difficulty passed.');
        const x = 5;
        var y = difficulty;
        if (!y)
            y = 5;
        if (arr.length === 1) {
            return arr[0];
        }
        const best = arr[0];
        const worses = arr.splice(1, arr.length - 1);
        const i = Math.floor(Math.random() * worses.length);
        const worse = worses[i];
        const rdm = Math.floor(Math.random() * x) + 1;
        if (rdm <= y) {
            return best;
        }
        else {
            return worse;
        }
    }
    decideNextMove(grid, difficulty, symbol, playerSymbol) {
        let movesScores = [];
        const moves = this.getAvailableMoves(grid);
        for (const move of moves) {
            this.makeMove(grid, move, symbol);
            let score = this.minimax(grid, 0, -Infinity, Infinity, false, symbol, playerSymbol);
            this.undoMove(grid, move);
            movesScores.push({ move, score });
        }
        movesScores.sort((a, b) => b.score - a.score);
        const selectedMove = this.randomMoves(movesScores, difficulty);
        return selectedMove.move;
    }
    botMove() {
        if (!this.data.started || this.data.ended || !this.bot)
            return;
        if (this.data.currentPlayer !== 42)
            return;
        const bot = this.data.players.find(p => p.id === 42);
        const symbol = bot ? bot.symbol : null;
        if (!symbol)
            throw new Error("There is an issue with the bot symbol.");
        const player = this.data.players.find(p => p.id === 666);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol)
            throw new Error("There is an issue with the player's symbol.");
        const nextMove = this.decideNextMove(this.grid, this.difficulty, symbol, playerSymbol);
        if (nextMove) {
            this.makeMove(this.grid, nextMove, symbol);
            this.emit(Events.UpdateGrid, { grid: this.grid });
            if (this.checkDraw(this.grid)) {
                this.data.ended = true;
                return this.emit(Events.GameEnded, { state: "draw", winner: null });
            }
            else if (this.hasWin(symbol, this.grid)) {
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
    trainingMove() {
        if (!this.data.started || this.data.ended || !this.bot)
            return;
        if (this.data.currentPlayer !== 42)
            return;
        const player = this.data.players.find(player => player.id === 666);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol)
            throw new Error("Something wrong with the player's symbol.");
        const bot = this.data.players.find(player => player.id === 42);
        const botSymbol = bot ? bot.symbol : null;
        if (!botSymbol)
            throw new Error("Something wrong with the bot symbol.");
        const nextMove = this.decideNextMove(this.grid, 5, playerSymbol, botSymbol);
        if (nextMove) {
            return this.emit(Events.TrainingMove, { x: nextMove.x, y: nextMove.y });
        }
    }
    get player() {
        if (!this.bot || this.bot && !this.data.started)
            return undefined;
        const player = this.data.players.find(player => player.id === 666);
        if (!player)
            throw new Error("Something wrong while getting the player.");
        return player;
    }
}
export { TicTacToe };