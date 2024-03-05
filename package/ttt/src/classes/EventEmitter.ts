enum Events {
  Move = "MOVE",
  GameStarted = "GAME_STARTED",
  GameEnded = "GAME_ENDED",
  UpdateGrid = "UPDATE_GRID",
  TrainingMove = "TRAINING_MOVE"
}

class EventEmitter {
  private events: { [event in Events]?: ((...args: any[]) => void)[] } = {};

  on(eventName: Events, listener: (...args: any[]) => void): void {
      (this.events[eventName] || (this.events[eventName] = [])).push(listener);
  }

  emit(eventName: Events, ...args: any[]): void {
      this.events[eventName]?.forEach(listener => listener(...args));
  }
}


export { EventEmitter, Events };
