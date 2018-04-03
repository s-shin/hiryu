"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listenEvent(emitter, event, cb) {
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
exports.listenEvent = listenEvent;
class EventListenerPool {
    constructor() {
        this.listeners = [];
    }
    listen(emitter, event, cb) {
        this.listeners.push(listenEvent(emitter, event, cb));
    }
    dispose() {
        for (const listener of this.listeners) {
            listener.dispose();
        }
    }
}
exports.EventListenerPool = EventListenerPool;
//# sourceMappingURL=index.js.map