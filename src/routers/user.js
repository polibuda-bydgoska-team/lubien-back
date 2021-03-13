const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

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
    .isLength({ min: 8 })
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
    ),
  body("phone").trim().notEmpty().isMobilePhone(),
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("companyName").trim(),
  body("street").trim().notEmpty(),
  body("houseNumber").trim().notEmpty(),
  body("addressAditionalInfo").trim(),
  body("city").trim(),
  body("county").trim(),
  body("postCode").trim().isPostalCode(),
];

router.get("/cart");

router.post("/cart");

router.post("/cart-delete-item");

router.get("/orders");

router.get("/orders/:orderId");

router.get("/user-details/:userId");

router.put("/user-details/:userId", validators);

module.exports = router;
