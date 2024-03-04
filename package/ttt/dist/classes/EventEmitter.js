var Events;
(function (Events) {
    Events["init"] = "init";
    Events["MoveMade"] = "moveMade";
    Events["GameStarted"] = "gameStarted";
    Events["GameEnded"] = "gameEnded";
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
