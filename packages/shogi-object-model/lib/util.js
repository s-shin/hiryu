"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flipObject(obj) {
    const r = {};
    for (const k of Object.keys(obj)) {
        r[obj[k]] = k;
    }
    return r;
}
exports.flipObject = flipObject;
//# sourceMappingURL=util.js.map