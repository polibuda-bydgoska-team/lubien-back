const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const isAuth = require("../middleware/isAuth");
const {
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  getOrder,
  getUserDetails,
  putEditUserDetails,
  putEditEmail,
} = require("../controllers/user");

const router = express.Router();

const validatorsUserDetails = [
  body("phone").trim().notEmpty().isMobilePhone(),
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("companyName").trim(),
  body("street").trim().notEmpty(),
  body("houseNumber").trim().notEmpty(),
  body("addressAditionalInfo").trim(),
  body("city").trim(),
  body("county").trim(),
  body("postCode").trim(),
];

const emailValidator = body("email")
  .isEmail()
  .withMessage("Please enter a valid email.")
  .custom((value, { req }) => {
    return User.findOne({ email: value }).then((userDoc) => {
      if (userDoc) {
        return Promise.reject("E-mail address already exists!");
      }
    });
  })
  .normalizeEmail();

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteItem);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getOrder);

router.get("/user-details/", isAuth, getUserDetails);

router.put("/user-details/", validatorsUserDetails, isAuth, putEditUserDetails);

router.put("/change-email", emailValidator, isAuth, putEditEmail);

module.exports = router;
