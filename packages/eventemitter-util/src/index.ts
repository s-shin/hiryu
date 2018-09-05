interface EventEmitter1<Event, Callback> {
  on(event: Event, cb: Callback): void;
  removeListener(event: Event, cb: Callback): void;
}

interface EventEmitter2<Event, Callback> {
  on(event: Event, cb: Callback): void;
  off(event: Event, cb: Callback): void;
}

export type EventEmitter<Event, Callback> = EventEmitter1<Event, Callback> | EventEmitter2<Event, Callback>;

export interface DisposableEventListener {
  dispose(): void;
}

export function listenEvent<Event, Callback>(
  emitter: EventEmitter<Event, Callback>,
  event: Event,
  cb: Callback,
): DisposableEventListener {
  emitter.on(event, cb);
  return {
    dispose() {
      if ((emitter as EventEmitter1<Event, Callback>).removeListener) {
        return (emitter as EventEmitter1<Event, Callback>).removeListener(event, cb);
      }
      if ((emitter as EventEmitter2<Event, Callback>).off) {
        return (emitter as EventEmitter2<Event, Callback>).off(event, cb);
      }
      throw new Error("invalid EventEmitter instance");
    },
  };
}

export class EventListenerPool {
  listeners: DisposableEventListener[] = [];

  listen<Event, Callback>(emitter: EventEmitter<Event, Callback>, event: Event, cb: Callback) {
    this.listeners.push(listenEvent(emitter, event, cb));
  }

  dispose() {
    for (const listener of this.listeners) {
      listener.dispose();
    }
  }
}
