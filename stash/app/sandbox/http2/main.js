const http2 = require("http2");
const fs = require("fs");
const path = require("path");

const server = http2.createSecureServer({
  key: fs.readFileSync(path.resolve(__dirname, "cert/server-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "cert/server-crt.pem")),
});

server.on("error", err => console.error(err));

server.on("stream", (stream, header) => {
  stream.respond({
    "content-type": "text/html",
    ":status": 200,
  });
  stream.end("<p>hello</p>");
});

server.listen(3000);
