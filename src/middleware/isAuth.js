const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];

    if (!token) {
      createError("Not authenticated. No auth token was provided", 401);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      createError("Not authenticated. Error when decodning token", 401);
    }

    req.userId = decodedToken.userId;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    error.message = "Not authenticated";
    error.statusCode = 401;
    next(error);
  }
};
