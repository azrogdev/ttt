enum Events {
  init = "init",
  MoveMade = "moveMade",
  GameStarted = "gameStarted",
  GameEnded = "gameEnded",
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
