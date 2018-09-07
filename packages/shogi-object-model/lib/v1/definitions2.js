"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usi_1 = require("./formats/usi");
function getState(h) {
    return usi_1.getSFEN(h).state;
}
exports.getState = getState;
//# sourceMappingURL=definitions2.js.map