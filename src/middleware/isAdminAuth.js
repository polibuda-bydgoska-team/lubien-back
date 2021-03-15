const User = require("../models/user");
const ROLE = require("../config/userRoles");
const createError = require("../utils/createError");

module.exports = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.userId);

    if (foundUser.role !== ROLE.ADMIN) {
      createError("Not allowed", 401);
    }

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
