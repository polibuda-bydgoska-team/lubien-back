const { body } = require("express-validator");
const User = require("../models/user");
const postalCodes = require("postal-codes-js");

exports.validatorsUserDetails = [
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
    .custom((value, { req }) => {
      if (postalCodes.validate("GB", value) === true) {
        return true;
      } else {
        throw new Error("The postal code is not in British format!");
      }
    }),
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
