const express = require("express");
const isAuth = require("../middleware/isAuth");
const {
  getProducts,
  getProduct,
  getCheckout,
  webhook,
} = require("../controllers/shop");

const router = express.Router();

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/checkout", isAuth, getCheckout);

router.post("/webhook", webhook);

module.exports = router;
