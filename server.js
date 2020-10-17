const http = require("http");

const app = require("./application");

const server = http.createServer(app);

server.listen(process.env.PORT ?? 3000, () =>
  console.log(
    `server env: ${process.env.NODE_ENV}, listen port: ${process.env.PORT}`
  )
);
