import process from "process";
import express from "express";
import morgan from "morgan";
// tslint:disable-next-line no-submodule-imports
import { check, validationResult } from "express-validator/check";
import { config, validateConfig, getSupportedEngines } from "./config";
import { go } from "./go";

{
  const err = validateConfig();
  if (!err) {
    console.error(err);
    process.exit(1);
  }
}

const app = express();

app.use(morgan("combined"));
app.use(express.static("public"));

app.get("/go", [
  check("engine").isIn(getSupportedEngines()),
  check("state").optional(),
  check("moves").optional(),
  check("timeout").toInt().isInt({ lt: 1, gt: 10 }).optional(),
], (req: express.Request, res: express.Response) => {
  {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
  }

  const engineName = req.query.engine;
  const state = req.query.state || "startpos";
  const moves = req.query.moves || "";
  const timeout = req.query.timeout || 5;

  go({ engineName, state, moves, timeout }).then(result => {
    res.send({ result });
  }, err => {
    console.error(err);
    res.status(500).send({ error: err.toString() });
  });
});

app.listen(config.get("port"));
