const bcrypt = require("bcrypt");

const userModel = require("../models/user");
const MailHelpers = require("../utils/mailHelpers");
const SmsHelpers = require("../utils/smsHelpers");
const { isEmptyString } = require("../utils/helpers");

const PASSWORD_SALT_ROUNDS = 12;
const mailHelpers = new MailHelpers();
const smsHelpers = new SmsHelpers();

module.exports = class UserController {
  async register(req, res) {
    const {
      name,
      password,
      phoneCode,
      phoneNumber,
      email,
      mode,
      confirm,
    } = req.body;

    if (password !== confirm) {
      return res
        .status(400)
        .json({ error_message: res.__("CONFIRMATION_OF_PASSWORD_IS_WRONG") });
    }
    if (password && password.length < 8) {
      return res
        .status(422)
        .json({ error_message: res.__("PASSWORD_LESS_THAN_EIGHT_CHARACTERS") });
    }
    if (mode === "EMAIL") {
      if (isEmptyString(email)) {
        return res.status(422).json({
          error_message: res.__("EMAIL_INVALID"),
        });
      }
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res
          .status(409)
          .json({ error_message: res.__("EMAIL_HAS_BEEN_REGISTERED") });
      }
      const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);
      const userBeSave = new userModel({
        name,
        email,
        password: hashedPassword,
      });
      const savedUser = await userBeSave.save();

      const mailInfo = mailHelpers.injectMailInfo({ to: email, name });
      await mailHelpers.sendMail(mailInfo);

      return res.status(201).json(savedUser.toJsonWebToken());
    } else if (mode === "PHONE") {
      if (isEmptyString(phoneCode) || isEmptyString(phoneNumber)) {
        return res.status(422).json({ error_message: "PHONE_INVALID" });
      }

      const existUser = await userModel.findOne({ phoneCode, phoneNumber });
      if (existUser) {
        return res
          .status(409)
          .json({ error_message: res.__("PHONE_NUMBER_HAS_BEEN_REGISTERED") });
      }
      const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);
      const userBeSave = new userModel({
        name,
        phoneCode,
        phoneNumber,
        password: hashedPassword,
      });
      const savedUser = await userBeSave.save();
      const fullPhoneNumber = phoneCode + phoneNumber;
      const smsInfo = smsHelpers.injectSmsInfo({ to: fullPhoneNumber, name });
      await smsHelpers.sendSms(smsInfo);

      return res.status(201).json(savedUser.toJsonWebToken());
    } else {
      return res
        .status(501)
        .json({ error_message: res.__("REGISTER_MODE_NOT_SUPPORTED") });
    }
  }
};
