const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/index");

const getCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });

  const totalUsers = await User.count();

  res.status(StatusCodes.OK).json({ totalUsers, users });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, role } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  if (req.user.userId === user.id && role) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You cannot change your own role" });
  }

  user.fullName = fullName || user.fullName;
  user.username = username || user.username;
  user.role = role || user.role;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "User updated successfully" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  if (req.user.userId === user.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You cannot delete your own account" });
  }

  await user.destroy();

  res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
};

const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.userId);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Old password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  resetPassword,
};
