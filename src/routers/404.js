const express = require("express");
const errorTypes = require("../config/errorTypes");
const router = express.Router();

router.use("*", (req, res, next) => {
  throw new Error(errorTypes.NOT_FOUND_ERROR);
});
module.exports = router;
