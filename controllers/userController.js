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
        .json({ error_message: res.__("confirmPasswordWrong") });
    }
    if (password && password.length < 8) {
      return res
        .status(422)
        .json({ error_message: res.__("passwordLessThanEightCharacters") });
    }
    if (mode === "EMAIL") {
      if (isEmptyString(email)) {
        return res.status(422).json({ error_message: "電子郵件未填寫完整" });
      }
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res
          .status(409)
          .json({ error_message: res.__("EmailHasBeenRegistered") });
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
        return res.status(422).json({ error_message: "電話號碼未填寫完整" });
      }

      const existUser = await userModel.findOne({ phoneCode, phoneNumber });
      if (existUser) {
        return res
          .status(409)
          .json({ error_message: res.__("PhoneNumberHasBeenRegistered") });
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
      return res.status(501).json({ error_message: "不支援此註冊模式" });
    }
  }
};
