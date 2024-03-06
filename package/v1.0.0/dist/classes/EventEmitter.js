var Events;
(function (Events) {
    Events["Move"] = "MOVE";
    Events["GameStarted"] = "GAME_STARTED";
    Events["GameEnded"] = "GAME_ENDED";
    Events["UpdateGrid"] = "UPDATE_GRID";
    Events["TrainingMove"] = "TRAINING_MOVE";
})(Events || (Events = {}));
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(eventName, listener) {
        (this.events[eventName] || (this.events[eventName] = [])).push(listener);
    }
    emit(eventName, ...args) {
        var _a;
        (_a = this.events[eventName]) === null || _a === void 0 ? void 0 : _a.forEach(listener => listener(...args));
    }
}
export { EventEmitter, Events };
