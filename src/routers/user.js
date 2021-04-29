const express = require("express");
const checkValidation = require("../middleware/checkValidation");
const isAuth = require("../middleware/isAuth");
const {
  getCart,
  postCart,
  postIncreaseItemInCart,
  postReduceItemInCart,
  postCartDeleteItem,
  getClearCart,
  getOrders,
  getOrder,
  getUserDetails,
  putEditUserDetails,
  putEditEmail,
} = require("../controllers/user");
const {
  validatorsUserDetails,
  emailValidator,
} = require("../validators/userValidator");

const router = express.Router();

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-increase-item", isAuth, postIncreaseItemInCart);

router.post("/cart-reduce-item", isAuth, postReduceItemInCart);

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

module.exports = router;
