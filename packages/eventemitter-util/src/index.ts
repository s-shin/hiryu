export interface SpecificEventEmitter<Event, Callback> {
  on(event: Event, cb: Callback): void;
  off?(event: Event, cb: Callback): void;
  removeEventListener?(event: Event, cb: Callback): void;
}

export interface DisposableEventListener {
  dispose(): void;
}

export function listenEvent<Event, Callback>(
  emitter: SpecificEventEmitter<Event, Callback>,
  event: Event,
  cb: Callback,
): DisposableEventListener {
  emitter.on(event, cb);
  return {
    dispose() {
      if (emitter.off) {
        return emitter.off(event, cb);
      }
      if (emitter.removeEventListener) {
        return emitter.removeEventListener(event, cb);
      }
      throw new Error("invalid eventemitter interface");
    },
  };
}

export class EventListenerPool {
  listeners: DisposableEventListener[] = [];

  listen<Event, Callback>(emitter: SpecificEventEmitter<Event, Callback>, event: Event, cb: Callback) {
    this.listeners.push(listenEvent(emitter, event, cb));
  }

  dispose() {
    for (const listener of this.listeners) {
      listener.dispose();
    }
  }
}
