"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("./Game"));
const interactable_1 = __importDefault(require("./interactable"));
const InteractableGame = interactable_1.default(Game_1.default);
exports.default = InteractableGame;
//# sourceMappingURL=InteractableGame.js.map