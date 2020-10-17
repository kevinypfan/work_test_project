const request = require("supertest");
const app = require("../application");
const mongoose = require("../datasources/mongo");
const userModel = require("../models/user");

const agent = request.agent(app);

beforeAll(async (done) => {
  await userModel.deleteMany({});
  done();
});

it("GET /test", async function (done) {
  agent.get("/test").expect("hey", done);
});

afterAll(async (done) => {
  mongoose.connection.close();
  done();
});
