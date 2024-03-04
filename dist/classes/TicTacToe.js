import { EventEmitter, Events, Player } from '../main.js';
class TicTacToe extends EventEmitter {
    constructor(options = {}) {
        var _a, _b, _c;
        super();
        this.bot = (_a = options.bot) !== null && _a !== void 0 ? _a : false;
        this.training = (_b = options.training) !== null && _b !== void 0 ? _b : false;
        this.difficulty = (_c = options.difficulty) !== null && _c !== void 0 ? _c : 5;
        this.data = { winner: null, player1: null, player2: null, players: [], started: false, ended: false };
        this.grid = this.init();
        this.emit(Events.init, ({ content: "test" }));
    }
    init() {
        this.on(Events.init, (data) => {
            console.log(data);
        });
        const structure = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Array.from({ length: 1 }, () => 0)));
        return structure;
    }
    get players() {
        const instance = this;
        return {
            add: (ids, force = false) => {
                if (instance.data.started || instance.data.ended)
                    return;
                if (instance.bot && !force)
                    return;
                const addPlayer = (id) => {
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
}
export { TicTacToe };
