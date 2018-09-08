"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDefaultReadLine = () => {
    let buf = Array();
    return (text) => {
        const lines = [];
        while (text.length > 0) {
            const idx = text.indexOf("\n");
            if (idx === -1) {
                buf.push(text);
                break;
            }
            lines.push(buf.concat(text.slice(0, idx)).join(""));
            buf = [];
            text = text.slice(idx + 1);
        }
        return lines;
    };
};
//# sourceMappingURL=readline.js.map