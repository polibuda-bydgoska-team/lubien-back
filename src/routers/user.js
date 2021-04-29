const express = require("express");
const checkValidation = require("../middleware/checkValidation");
const isAuth = require("../middleware/isAuth");
const {
  getCart,
  postCart,
  postCartChangeQuantity,
  postCartDeleteItem,
  getClearCart,
  getOrders,
  getOrder,
  getUserDetails,
  putEditUserDetails,
  putEditEmail,
  putChangePassword,
} = require("../controllers/user");
const {
  validatorsUserDetails,
  emailValidator,
  newPasswordValidator,
} = require("../validators/userValidator");

const router = express.Router();

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-change-quantity", isAuth, postCartChangeQuantity);

router.post("/cart-delete-item", isAuth, postCartDeleteItem);

router.get("/clear-cart", isAuth, getClearCart);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getOrder);

router.get("/user-details", isAuth, getUserDetails);

router.put(
  "/user-details",
  validatorsUserDetails,
  checkValidation(),
  isAuth,
  putEditUserDetails
);

router.put(
  "/change-email",
  emailValidator,
  checkValidation(),
  isAuth,
  putEditEmail
);

router.put(
  "/change-password",
  newPasswordValidator,
  checkValidation(),
  isAuth,
  putChangePassword
);

module.exports = router;
