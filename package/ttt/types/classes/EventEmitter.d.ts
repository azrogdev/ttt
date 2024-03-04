declare enum Events {
    init = "init",
    MoveMade = "moveMade",
    GameStarted = "gameStarted",
    GameEnded = "gameEnded"
}
declare class EventEmitter {
    private events;
    on(eventName: Events, listener: (...args: any[]) => void): void;
    emit(eventName: Events, ...args: any[]): void;
}
export { EventEmitter, Events };
