const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/index");
const { createJWT } = require("../utils/tokenUtils");

const register = async (req, res) => {
  const { username } = req.body;

  const userAlreadyExists = await User.findOne({
    where: { username },
  });

  if (userAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "username already exists" });
  }

  const userCount = await User.count();

  const isFirstAccount = userCount === 0;

  req.body.role = isFirstAccount ? "ADMIN" : "CASHIER";

  await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username },
  });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "invalid credentials" });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "invalid credentials" });
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const token = createJWT(payload);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({ msg: "user logged in" });
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
