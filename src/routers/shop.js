const express = require("express");
const isAuth = require("../middleware/isAuth");
const paginatedResults = require("../middleware/paginatedResults");
const {
  getProducts,
  getProduct,
  getCheckout,
  webhook,
} = require("../controllers/shop");
const Product = require("../models/product");

const router = express.Router();

router.get("/products", paginatedResults(Product), getProducts);

router.get("/products/:productId", getProduct);

router.get("/checkout", isAuth, getCheckout);

router.post("/webhook", webhook);

module.exports = router;
