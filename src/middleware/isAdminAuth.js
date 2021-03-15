const errorTypes = require("../config/errorTypes");
const User = require("../models/user");
const ROLE = require("../config/userRoles");

module.exports = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.userId);

    if (foundUser.role !== ROLE.ADMIN) {
      throw new Error("Not allowed.");
    }

    next();
  } catch (error) {
    next(errorTypes.NOT_AUTHORIZED);
  }
};
