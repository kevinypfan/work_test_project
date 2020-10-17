require("./config");
require("./datasources/mongo");

const path = require("path");
const express = require("express");
const { I18n } = require("i18n");

const userRoute = require("./routes/user");

const app = express();

const i18n = new I18n({
  locales: ["en", "zh-hant"],
  defaultLocale: "en",
  queryParameter: "lang",
  directory: path.join(__dirname, "locales"),
});
app.use(express.json());
app.use(i18n.init);

app.use("/v1", userRoute);

module.exports = app;
