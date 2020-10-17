const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    phoneCode: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.methods.toJsonWebToken = function () {
  const userObject = this.toObject();
  delete userObject.password;
  const token = jwt.sign(userObject, process.env.JWT_SECRET);
  return { token };
};

module.exports = mongoose.model("User", userSchema);
