const mongoose = require("../datasources/mongo");
const userModel = require("../models/user");

beforeAll(async (done) => {
  await userModel.deleteMany({});
  done();
});

afterAll(async (done) => {
  mongoose.connection.close();
  done();
});
