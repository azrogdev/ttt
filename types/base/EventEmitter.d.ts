declare enum Events {
    Move = "MOVE",
    GameStarted = "GAME_STARTED",
    GameEnded = "GAME_ENDED",
    UpdateGrid = "UPDATE_GRID",
    TrainingMove = "TRAINING_MOVE"
}
declare class EventEmitter {
    private events;
    on(eventName: Events, listener: (...args: any[]) => void): void;
    emit(eventName: Events, ...args: any[]): void;
}
export { EventEmitter, Events };
