const { body } = require("express-validator");
const User = require("../models/user");

exports.validatorsUserDetails = [
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

exports.emailValidator = [
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
];
