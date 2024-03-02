/**
 * Represents a player of tictactoe.
 * @constructor
 * @param {number} id - The player id.
 * @param {object} instance - The tictactoe instance.
 * @returns {object} the player instancied.
 */

class Player {
    constructor(id, instance) {
        if (!id || isNaN(id)) throw Error("Invalid player id.")
        if (!instance || !instance instanceof TicTacToe) throw Error("Invalid instance.")
        this.id = id;
        this.morpion = instance;

        this.data = instance.data;
        instance.data.players.push(this)
    }

    /**
     * The function to place the player symbol.
     * @constructor
     * @param {number} x - The x coordinates.
     * @param {number} y - The y coordinates.
     * @param {object} instance - The tictactoe instance.
     * @returns {void}
     */

    move(x, y, instance) {

        if (!instance || !instance instanceof TicTacToe) throw Error("Invalid instance.")
        this.data = instance.data;
        if (!this.data.started || this.data.ended) return;
        const symbol = this.data.players.find(p => p.id === this.id).symbol;
        if (!symbol) throw new Error("Something wrong with the symbol")
        instance.place(x, y, symbol);
    }
}
/**
 * Represents a TicTacToe game.
 * @constructor
 * @param {object} options - Configuration options for the game.
 * @param {boolean} options.bot- Indicates if the game is against a bot.
 * @param {boolean} options.training - Indicates if the bot advise you.
 * @param {number} options.difficulty - Indicates the level of the bot if there any (1 ~ 5, random ~ prometheus).
 * @returns {object} the tictactoe instancied.
 */
class TicTacToe {
    constructor(options = {}) {
        if (options.bot && typeof options.bot !== "boolean") throw new Error("The 'bot' option must be a boolean.");
        this.bot = options.bot === undefined ? true : options.bot;
        if (options.difficulty !== undefined) {
            if (typeof options.difficulty !== "number" || options.difficulty < 1 || options.difficulty > 5) {
                throw new Error("The 'difficulty' option must be a number between 1 and 5.");
            }
        }
        this.difficulty = options.difficulty || 5;
        if (options.training && typeof options.training !== "boolean") throw new Error("The 'bot' option must be a boolean.");
        this.training = options.training === undefined ? false : options.training;
        this.playersList = new Map();
        this.grid = this.init();
        this.data = { players: [], started: false, ended: false, winner: null, player1: null, player2: null };
    }
    init() {
        const grid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Array.from({ length: 1 }, () => 0)));
        return grid;
    }
    get players() {
        const instance = this;
        return {
            /**
            * Represents the add function.
            * @constructor
            * @param {object|number} ids - ids or id to add.
            * @param {boolean} force - force whenever the game is against the bot.
            * usage : add(id, true) or add([id, id]).
            * @returns {void}
            */
            add: function (ids, force = false) {
                if (instance.data.started) return;
                if (typeof force !== "boolean") return;
                if (instance.bot && !force) return;
                if (ids && Array.isArray(ids)) {
                    ids.forEach((id) => {
                        if (isNaN(id) || instance.playersList.size === 2 || instance.playersList.has(id)) return;
                        const newPlayer = new Player(id, instance);
                        instance.playersList.set(id, newPlayer);
                    })
                } else if (ids) {
                    if (isNaN(ids) || instance.playersList.size === 2 || instance.playersList.has(ids)) return;
                    const newPlayer = new Player(ids, instance);
                    instance.playersList.set(ids, newPlayer);
                }

            },
            /**
            * Represents the get function.
            * @constructor
            * @param {object|number} id - the id of the player to get.
            * @returns {object} the player data.
            */
            get: function (id) {
                if (!id || isNaN(id)) throw new Error("Invalid player id provided.")
                if (instance.bot) return;
                const player = instance.playersList.get(id);
                if (!player) {
                    return null; // invalid player
                }
                return {
                    player,
                    /**
                    * Represents the move function.
                    * @constructor
                    * @param {number} x - The x coordinates.
                    * @param {number} y - The y coordinates.
                    */
                    move: function (x, y) {
                        if (instance.bot) return;
                        player.move(x, y, instance);
                    }
                };
            }
        };
    }

    /**
     * Represents the function to place the symbol.
     * @constructor
     * @param {number} x - the coordinates x.
     * @param {number} y - the coordinates y.
     * @param {string} symbol - the symbol to place.
     * @returns {void}
     */
    place(x, y, symbol) {
        const isValid = (grid, row, col) => {
            return grid[row][col][0] === 0;
        }
        const isInGrid = (grid, row, col) => {
            const numRows = grid.length;
            const numCols = grid[0].length;
            return col >= 0 && col < numCols && row >= 0 && row < numRows;
        }
        if (!isInGrid(this.grid, y, x)) return // cell out of grid
        if (!isValid(this.grid, y, x)) return // cell filled
        this.grid[y][x][0] = symbol;
        if (this.hasWin(symbol, this.grid)) {
            const player = this.data.players.find(p => p.symbol === symbol);
            this.data.winner = player.id;
            this.data.ended = true;
        }
        if (this.checkDraw(this.grid)) {
            this.data.ended = true;
        }

    }
    /**
     * Represents the function to start the game.
     */
    start() {
        if (!this.bot && this.data.players !== 2) return;
        const players = [];
        const randomNumber = Math.floor(Math.random() * 2);
        const firstSymbol = randomNumber === 0 ? "x" : "o";
        const secondSymbol = firstSymbol === "x" ? "o" : "x";
        if (this.bot) {
            this.players.add(666, true)
            this.players.add(42, true)
            players.push({ id: 666, symbol: firstSymbol });
            players.push({ id: 42, symbol: secondSymbol });
        } else {
            players.push({ id: this.data.players[0].id, symbol: firstSymbol })
            players.push({ id: this.data.players[1].id, symbol: secondSymbol })
        }
        this.data.players = players;
        this.data.player1 = players.find(p => p.symbol === "x").id;
        this.data.player2 = players.find(p => p.symbol === "o").id;
        this.data.started = true;
    }
    /**
     * Represents the function to get the player. available whenever the game is against the bot.
     */
    get player() {
        if (this.bot && this.data.started) {
            const player = this.data.players.find(p => p.id === 666);
            if (player) {
                const thisPlayer = this.playersList.get(player.id) || null;
                const instance = this;
                return {
                    /**
                     * Represents the function to get the player id.
                     */
                    get id() {
                        return player.id;
                    },
                    thisPlayer,
                    /**
                     * Represents the function to move the player.
                     */
                    move: function (x, y) {
                        thisPlayer.move(x, y, instance);
                    }
                };
            }
        }
        return undefined;
    }
    /**
     * Represents the function to get a moves based on the difficulty.
     * @param {object} arr - the array of available moves.
     * @param {number} difficulty - the difficulty set.
     */
    randomMoves(arr, difficulty) {
        if (!Array.isArray(arr) || arr.length < 1 || isNaN(difficulty)) throw new Error("Invalid params provided.")
        const x = 5;
        const y = difficulty;
        if (arr.length === 1) {
            return arr[0]
        }
        const best = arr[0]
        const worses = arr.splice(1, arr.length - 1)
        const i = Math.floor(Math.random() * worses.length)
        const worse = worses[i]
        const rdm = Math.floor(Math.random() * x) + 1;
        if (rdm <= y) {
            return best;
        } else {
            return worse;
        }

    }
    /**
     * Represents the function to get the best move for the player to train him.
     */
    trainingMove() {
        if (!this.bot) return;
        if (!this.training) return;
        const bot = this.data.players.find(p => p.id === 666);
        const symbol = bot ? bot.symbol : null;
        if (!symbol) throw new Error("There is an issue with the player's symbol.");
        const player = this.data.players.find(p => p.id === 42);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol) throw new Error("There is an issue with the bot symbol.");
        /**
         * Represents the function to decide the next move.
         * @param {object} grid the game grid.
         */
        const decideNextMove = (grid) => {
            let bestScore = -Infinity;
            let bestMove;
            const moves = this.getAvailableMoves(grid);

            for (const move of moves) {
                this.makeMove(grid, move, symbol);
                let score = this.minimax(grid, 0, -Infinity, Infinity, false, symbol, playerSymbol);
                this.undoMove(grid, move);

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }

            return bestMove;
        }

        const nextMove = decideNextMove(this.grid);
        if (nextMove) {
            return nextMove;
        } else {
            return null; // not any available moves
        }
    }
    /**
    * Represents the function to make a move.
    * @param {object} grid the game grid.
    * @param {object} move the move to do.
    * @param {string} symbol the symbol to place.
    */
    makeMove(grid, move, symbol) {
        const { x, y } = move;
        grid[y][x][0] = symbol;
    }
    /**
    * Represents the function to undo a move.
    * @param {object} grid the game grid.
    * @param {object} move the move to undo.
    */
    undoMove(grid, move) {
        const { x, y } = move;
        grid[y][x][0] = 0;
    }
    /**
    * Represents the function to get the availables moves.
    * @param {object} grid the game grid.
    */
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
    /**
    * Represents the function minimax to eval the moves based on their path, their restul etc.
    * @param {object} grid the game grid.
    * @param {number} depth the depth value in the game tree.
    * @param {number} alpha the best value for the bot at the actual depth in the tree.
    * @param {number} beta the best value for the human at the actual depth in the tree.
    * @param {boolean} isMaximizing true if the function have to search to maximize the bot's score.
    * false if the function have to maximize the player's score.
    * @param {string} botSymbol the bot symbol.
    * @param {string} playerSymbol the player symbol.
    * @returns {number} the score.
    */
    minimax(grid, depth, alpha, beta, isMaximizing, botSymbol, playerSymbol) {
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
    botMove() {
        if (!this.bot) return;
        if (!this.data.started) return;
        if (this.data.ended) return;
        const bot = this.data.players.find(p => p.id === 42);
        const symbol = bot ? bot.symbol : null;
        if (!symbol) throw new Error("There is an issue with the bot symbol.");
        const player = this.data.players.find(p => p.id === 666);
        const playerSymbol = player ? player.symbol : null;
        if (!playerSymbol) throw new Error("There is an issue with the player's symbol.");

        const decideNextMove = (grid) => {
            let movesScores = [];
            const moves = this.getAvailableMoves(grid);

            for (const move of moves) {
                this.makeMove(grid, move, symbol);
                let score = this.minimax(grid, 0, -Infinity, Infinity, false, symbol, playerSymbol);
                this.undoMove(grid, move);
                movesScores.push({ move, score });
            }

            movesScores.sort((a, b) => b.score - a.score);
            const selectedMove = this.randomMoves(movesScores, this.difficulty)
            return selectedMove.move;
        };

        const nextMove = decideNextMove(this.grid, this.difficulty);
        if (nextMove) {
            this.makeMove(this.grid, nextMove, symbol);
            if (this.checkDraw(this.grid)) {
                this.data.ended = true;
            } else if (this.hasWin(symbol, this.grid)) {
                this.data.ended = true;
                this.data.winner = 42;
            }
        } else {
            return; // not any available moves
        }
    }
    isAGrid(grid) {
        const originalGrid = this.grid;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i][j].length !== originalGrid[i][j].length || grid[i][j][0] !== originalGrid[i][j][0]) return false;
            }
        }
        return true;
    }
    hasWin(symbol, originalGrid) {
        if (!this.data.started) return;
        if (this.data.ended) return;
        if (!symbol || !this.data.players.find(p => p.symbol === symbol)) throw new Error("'symbol' is not specified or invalid.")
        if (!originalGrid || !this.isAGrid(originalGrid)) throw new Error("'originalGrid' is not specified or invalid.")
        const grid = JSON.parse(JSON.stringify(originalGrid));
        const diagonalFilled = () => {
            let diagonal1 = true, diagonal2 = true;
            for (let i = 0; i < 3; i++) {
                diagonal1 &= grid[i][i][0] === symbol;
                diagonal2 &= grid[2 - i][i][0] === symbol;
            }
            return diagonal1 || diagonal2;
        };
        const lineOrColumnFilled = () => {
            for (let i = 0; i < 3; i++) {
                let rowFilled = true, colFilled = true;
                for (let j = 0; j < 3; j++) {
                    rowFilled &= grid[i][j][0] === symbol;
                    colFilled &= grid[j][i][0] === symbol;
                }
                if (rowFilled || colFilled) return true;
            }
            return false;
        };

        return diagonalFilled() || lineOrColumnFilled();
    }
    checkDraw(originalGrid) {
        if (!originalGrid || !this.isAGrid(originalGrid)) throw new Error("'originalGrid' is not specified or invalid.")
        const grid = JSON.parse(JSON.stringify(originalGrid))
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x][0] === 0) {
                    return false;
                }
            }
        }

        if (this.hasWin(this.data.players[0].symbol, grid) || this.hasWin(this.data.players[1].symbol, grid)) {
            return false;
        }
        return true;
    }
}
