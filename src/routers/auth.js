const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const { signup, login } = require("../controllers/auth");

const router = express.Router();

module.exports = router;

const validators = [
  body("email")
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
  body(
    "password",
    "Password must contains minimum 8 characters, at least one uppercase letter, one lowercase letter and one number"
  )
    .trim()
    .isLength({ min: 8 }),
  // .matches(
  //   "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
  // ),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  body("phone").trim().notEmpty().isMobilePhone(),
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("companyName").trim(),
  body("street").trim().notEmpty(),
  body("houseNumber").trim().notEmpty(),
  body("addressAdditionalInfo").trim(),
  body("city").trim(),
  body("county").trim(),
  body("postCode").trim(),
];

router.put("/signup", validators, signup);
router.post("/login", login);
