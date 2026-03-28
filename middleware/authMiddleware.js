const { StatusCodes } = require("http-status-codes");
const { verifyJWT } = require("../utils/tokenUtils");

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authentication invalid" });
  }

  try {
    const user = verifyJWT(token);
    const { userId, role } = user;
    req.user = { userId, role };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authentication invalid" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized to access this route" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
