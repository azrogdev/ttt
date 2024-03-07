import { TicTacToe, Player } from "../main.js";
function validateProperty(value, expectedTypes, propertyName) {
    const typesToCheck = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];
    if (!typesToCheck.includes(typeof value)) {
        throw new TypeError(`Invalid value for '${propertyName}' (Expected: ${typesToCheck.join(" or ")}, Received: ${typeof value})`);
    }
}
function Save(instance, toJSON = false) {
    if (!(instance instanceof TicTacToe))
        throw new Error(`Invalid 'instance' received.`);
    validateProperty(toJSON, "boolean", "toJSON");
    if (!instance.data || !instance.data.started || instance.data.ended)
        return undefined;
    const playersBackup = instance.data.players.map(player => ({
        id: player.id,
        symbol: player.symbol,
        bot: player.bot
    }));
    playersBackup.forEach((player) => {
        validateProperty(player.id, "number", "player.id");
        validateProperty(player.symbol, "string", "player.symbol");
        validateProperty(player.bot, "boolean", "player.bot");
    });
    const backup = {
        bot: instance.bot,
        training: instance.training,
        difficulty: instance.difficulty,
        grid: instance.flatGrid,
        data: {
            winner: instance.data.winner,
            player1: instance.data.player1,
            player2: instance.data.player2,
            currentPlayer: instance.data.currentPlayer,
            started: instance.data.started,
            ended: instance.data.ended,
            players: playersBackup
        }
    };
    if (toJSON) {
        return JSON.stringify(backup);
    }
    else
        return backup;
}
function Restore(backup) {
    var backupData;
    if (typeof backup === 'string') {
        try {
            backupData = JSON.parse(backup);
        }
        catch (error) {
            throw new Error("Invalid JSON data provided.");
        }
    }
    else {
        backupData = backup;
    }
    const { bot, training, difficulty, data, grid: flatGrid } = backupData;
    validateProperty(bot, "boolean", "bot");
    validateProperty(training, "boolean", "training");
    validateProperty(difficulty, "number", "difficulty");
    if (!Array.isArray(flatGrid) || flatGrid.length !== 9)
        throw new Error(`Invalid 'flatGrid' received.`);
    const instance = new TicTacToe({
        bot: bot,
        training: training,
        difficulty: difficulty
    });
    const players = [];
    if (!Array.isArray(data.players) || data.players.length !== 2)
        throw new Error(`Invalid 'data.players' received.`);
    data.players.forEach((player) => {
        validateProperty(player.id, "number", "player.id");
        validateProperty(player.symbol, "string", "player.symbol");
        validateProperty(player.bot, "boolean", "player.bot");
        players.push(new Player(player.id, instance, { bot: player.bot, symbol: player.symbol }));
    });
    if (data.winner !== null)
        validateProperty(data.winner, "object", "data.winner");
    validateProperty(data.player1, "number", "data.player1");
    validateProperty(data.player2, "number", "data.player2");
    validateProperty(data.currentPlayer, "number", "data.currentPlayer");
    validateProperty(data.started, "boolean", "data.started");
    validateProperty(data.ended, "boolean", "data.ended");
    instance.data = {
        winner: data.winner,
        player1: data.player1,
        player2: data.player2,
        currentPlayer: data.currentPlayer,
        players: players,
        started: data.started,
        ended: data.ended
    };
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            instance.grid[i][j][0] = flatGrid[i * 3 + j];
        }
    }
    return instance;
}
export { Save, Restore, validateProperty };
