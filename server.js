require("dotenv").config();

const express = require("express");
const userRoute = require("./routes/user");

const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/express_register", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/v1", userRoute);

app.listen(process.env.PORT, () =>
  console.log("server listen port: " + process.env.PORT)
);
