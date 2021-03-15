const express = require("express");
const createError = require("../utils/createError");
const router = express.Router();

router.use("*", (req, res, next) => {
  createError("Not found", 404);
});
module.exports = router;
