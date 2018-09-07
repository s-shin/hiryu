"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = __importDefault(require("socket.io"));
const ws = __importStar(require("./ws"));
const app = express_1.default();
const server = new http.Server(app);
const io = socket_io_1.default(server);
app.use(morgan_1.default("combined"));
app.use(express_1.default.static("static"));
ws.setup(io);
// TODO: make server address configurable
server.listen(3000);
//# sourceMappingURL=index.js.map