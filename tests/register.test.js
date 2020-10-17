const request = require("supertest");
const app = require("../application");

describe("會員註冊", function () {
  const agent = request.agent(app);

  it("電子信箱註冊成功", function (done) {
    const payload = {
      mode: "EMAIL",
      name: "Kevin",
      email: "kevinypfan@gmail.com",
      password: "abcd1234",
      confirm: "abcd1234",
    };
    agent.post("/v1/user/register").send(payload).expect(201, done);
  });

  it("行動電話註冊成功", function (done) {
    const payload = {
      mode: "PHONE",
      name: "Allen",
      phoneCode: "+886",
      phoneNumber: "988029758",
      password: "abcd1234",
      confirm: "abcd1234",
    };
    agent.post("/v1/user/register").send(payload).expect(201, done);
  });

  it("確認密碼輸入錯誤", function (done) {
    const payload = {
      mode: "PHONE",
      name: "Allen",
      phoneCode: "+886",
      phoneNumber: "988029758",
      password: "abcd1234",
      confirm: "abcd1234d",
    };
    agent.post("/v1/user/register").send(payload).expect(400, done);
  });

  it("確認少於8個字元", function (done) {
    const payload = {
      mode: "PHONE",
      name: "Allen",
      phoneCode: "+886",
      phoneNumber: "988029758",
      password: "abcd12",
      confirm: "abcd12",
    };
    agent.post("/v1/user/register").send(payload).expect(422, done);
  });

  it("手機已被使用", function (done) {
    const payload = {
      mode: "PHONE",
      name: "Allen",
      phoneCode: "+886",
      phoneNumber: "988029758",
      password: "abcd1234",
      confirm: "abcd1234",
    };
    agent.post("/v1/user/register").send(payload).expect(409, done);
  });

  it("Email已被使用", function (done) {
    const payload = {
      mode: "EMAIL",
      name: "Kevin",
      email: "kevinypfan@gmail.com",
      password: "abcd1234",
      confirm: "abcd1234",
    };
    agent.post("/v1/user/register").send(payload).expect(409, done);
  });
});
