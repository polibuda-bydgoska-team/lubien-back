const { validationResult } = require("express-validator");
const createError = require("../utils/createError");

exports.checkValidation = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    createError(
      "Validation failed, entered data is incorrect.",
      422,
      validationErrors.array()
    );
  }
  next();
};
