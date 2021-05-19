const express = require("express");
const { signup, login } = require("../controllers/auth");
const { registerValidator } = require("../validators/authValidator");
const checkValidation = require("../middleware/checkValidation");
const { createAccountLimiter } = require("../config/rateLimits");

const router = express.Router();

router.put(
  "/signup",
  createAccountLimiter,
  registerValidator,
  checkValidation(),
  signup
);
router.post("/login", login);

module.exports = router;
