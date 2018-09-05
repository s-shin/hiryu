"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listenEvent(emitter, event, cb) {
    emitter.on(event, cb);
    return {
        dispose() {
            if (emitter.removeListener) {
                return emitter.removeListener(event, cb);
            }
            if (emitter.off) {
                return emitter.off(event, cb);
            }
            throw new Error("invalid EventEmitter instance");
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