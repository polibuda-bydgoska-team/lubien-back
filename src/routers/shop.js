const express = require("express");

const router = express.Router();

router.get("/products");

router.get("/products/:productId");

router.get("/checkout");

router.get("/checkout/success");

router.get("/checkout/cancel");

module.exports = router;
