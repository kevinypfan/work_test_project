require("dotenv").config();

const express = require("express");
const path = require("path");
const { I18n } = require("i18n");

const userRoute = require("./routes/user");

const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/express_register", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const i18n = new I18n({
  locales: ["en", "zh-hant"],
  defaultLocale: "en",
  queryParameter: "lang",
  directory: path.join(__dirname, "locales"),
});
app.use(express.json());
app.use(i18n.init);

app.use("/v1", userRoute);

app.get("/test", (req, res) => {
  res.send(res.__("confirmPasswordWrong"));
});

app.listen(process.env.PORT, () =>
  console.log("server listen port: " + process.env.PORT)
);
