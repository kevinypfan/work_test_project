var nodemailer = require("nodemailer");

module.exports = class MailHelpers {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.GMAIL_USERNAME}@gmail.com`,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  injectMailInfo({ to, name }) {
    return {
      from: `${process.env.GMAIL_USERNAME}@gmail.com`,
      to,
      subject: "註冊成功通知信",
      text: `${name} 您好！ 歡迎加入 AmazingTalker`,
    };
  }

  async sendMail(mailInfo) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailInfo, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  }
};
