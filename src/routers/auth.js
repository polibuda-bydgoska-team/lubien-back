const express = require("express");
const { signup, login } = require("../controllers/auth");
//const { registerValidator } = require("../validators/authValidator");
const checkValidation = require("../middleware/checkValidation");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

registerValidator = [
  body("email").trim().notEmpty().withMessage("Email is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    )
    .withMessage(
      "Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please confirm password."),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  body("phone")
    .trim()
    .notEmpty()
    .isMobilePhone()
    .withMessage("Phone is required."),
  body("firstName").trim().notEmpty().withMessage("First name is required."),
  body("lastName").trim().notEmpty().withMessage("Last name is required."),
  body("companyName").optional().trim(),
  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required."),
  body("address.houseNumber")
    .trim()
    .notEmpty()
    .withMessage("House number is required."),
  body("address.addressAdditionalInfo").optional().trim(),
  body("address.city").trim().notEmpty().withMessage("City is required."),
  body("address.county").optional().trim(),
  body("address.postCode")
    .trim()
    .notEmpty()
    .withMessage("Post code is required."),
];

router.put("/signup", registerValidator, signup);
router.post("/login", login);

module.exports = router;
