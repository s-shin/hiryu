import * as http from "http";
import express from "express";
import morgan from "morgan";
import socketIO from "socket.io";
import * as ws from "./ws";

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

app.use(morgan("combined"));
app.use(express.static("static"));

ws.setup(io);

// TODO: make server address configurable
server.listen(3000);
