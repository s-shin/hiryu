"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
// tslint:disable-next-line no-submodule-imports
const check_1 = require("express-validator/check");
const config_1 = require("./config");
const go_1 = require("./go");
{
    const err = config_1.validateConfig();
    if (!err) {
        console.error(err);
        process_1.default.exit(1);
    }
}
const app = express_1.default();
app.use(morgan_1.default("combined"));
app.use(express_1.default.static("public"));
app.get("/go", [
    check_1.check("engine").isIn(config_1.getSupportedEngines()),
    check_1.check("state").optional(),
    check_1.check("moves").optional(),
    check_1.check("timeout").toInt().isInt({ lt: 1, gt: 10 }).optional(),
], (req, res) => {
    {
        const result = check_1.validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send(result.array());
        }
    }
    const engineName = req.query.engine;
    const state = req.query.state || "startpos";
    const moves = req.query.moves || "";
    const timeout = req.query.timeout || 5;
    go_1.go({ engineName, state, moves, timeout }).then(result => {
        res.send({ result });
    }, err => {
        console.error(err);
        res.status(500).send({ error: err.toString() });
    });
});
app.listen(config_1.config.get("port"));
//# sourceMappingURL=index.js.map