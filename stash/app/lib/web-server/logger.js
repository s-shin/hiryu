"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { createLogger, format, transports } = winston_1.default;
exports.logger = createLogger({
    level: "debug",
    format: format.combine(format.timestamp(), format.simple()),
    transports: [
        new transports.Console(),
    ],
});
//# sourceMappingURL=logger.js.map