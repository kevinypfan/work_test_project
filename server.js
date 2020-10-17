require("./config");

const http = require("http");

const app = require("./application");

const server = http.createServer(app);

server.listen(process.env.PORT, () =>
  console.log(
    `server env: ${process.env.NODE_ENV}, listen port: ${process.env.PORT}`
  )
);
