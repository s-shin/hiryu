"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
function parseRecord(data) {
    const strs = data.split(/[ \r\n\t]+/);
    if (strs.length === 0) {
        return new Error("");
    }
    const result = strs.pop();
    const events = [];
    for (const s of strs) {
        const color = s[0] === "+" ? definitions_1.Color.BLACK : definitions_1.Color.WHITE;
        const srcSquare = [Number(s[1]), Number(s[2])];
        const dstSquare = [Number(s[3]), Number(s[4])];
        if (!definitions_1.isSquare(dstSquare)) {
            return new Error("");
        }
        const dstPiece = s.substr(5, 2);
        if (!definitions_1.isPiece(dstPiece)) {
            return new Error("");
        }
        events.push({
            type: definitions_1.EventType.MOVE,
            color,
            srcSquare: definitions_1.isSquare(srcSquare) ? srcSquare : null,
            dstSquare,
            dstPiece,
        });
    }
    const loose = result.match(/SENTE.*/) ? definitions_1.Color.WHITE : definitions_1.Color.BLACK;
    events.push({
        type: definitions_1.EventType.RESIGN,
        color: loose,
    });
    return {
        competition: "",
        location: "",
        startingSetup: { handicap: definitions_1.Handicap.NONE },
        events,
    };
}
exports.parseRecord = parseRecord;
//# sourceMappingURL=shogiwars.js.map