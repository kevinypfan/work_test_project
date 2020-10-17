module.exports = class SmsHelpers {
  injectSmsInfo({ to, name }) {
    return {
      to,
      text: `${name} 您好！ 歡迎加入 AmazingTalker`,
    };
  }

  async sendSms(smsInfo) {
    return new Promise((resolve) => {
      console.log(smsInfo);
      resolve(smsInfo);
    });
  }
};
