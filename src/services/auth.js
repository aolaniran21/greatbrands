const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { hashPassword, comparePassword } = require("../utils/passwordUtil");
const { secret, expiresIn } = require("../config/jwt");

const registerUser = async (email, password) => {
  const hashedPassword = await hashPassword(password);
  return User.create({ email, password: hashedPassword });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
    expiresIn,
  });

  return { token, user };
};

module.exports = { registerUser, loginUser };
