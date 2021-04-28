const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidator = [
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
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
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
  body("street").trim().notEmpty().withMessage("Street address is required."),
  body("houseNumber")
    .trim()
    .notEmpty()
    .withMessage("House number is required."),
  body("addressAdditionalInfo").optional().trim(),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("county").optional().trim(),
  body("postCode").trim().notEmpty().withMessage("Post code is required."),
];
