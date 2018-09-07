interface EventEmitter1<Event, Callback> {
    on(event: Event, cb: Callback): void;
    removeListener(event: Event, cb: Callback): void;
}
interface EventEmitter2<Event, Callback> {
    on(event: Event, cb: Callback): void;
    off(event: Event, cb: Callback): void;
}
export declare type EventEmitter<Event, Callback> = EventEmitter1<Event, Callback> | EventEmitter2<Event, Callback>;
export interface DisposableEventListener {
    dispose(): void;
}
export declare function listenEvent<Event, Callback>(emitter: EventEmitter<Event, Callback>, event: Event, cb: Callback): DisposableEventListener;
export declare class EventListenerPool {
    listeners: DisposableEventListener[];
    listen<Event, Callback>(emitter: EventEmitter<Event, Callback>, event: Event, cb: Callback): void;
    dispose(): void;
}
export {};
