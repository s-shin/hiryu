export interface SpecificEventEmitter<Event, Callback> {
    on(event: Event, cb: Callback): void;
    off?(event: Event, cb: Callback): void;
    removeEventListener?(event: Event, cb: Callback): void;
}
export interface DisposableEventListener {
    dispose(): void;
}
export declare function listenEvent<Event, Callback>(emitter: SpecificEventEmitter<Event, Callback>, event: Event, cb: Callback): DisposableEventListener;
export declare class EventListenerPool {
    listeners: DisposableEventListener[];
    listen<Event, Callback>(emitter: SpecificEventEmitter<Event, Callback>, event: Event, cb: Callback): void;
    dispose(): void;
}
