const express = require("express");
const { signup, login } = require("../controllers/auth");
const { registerValidator } = require("../validators/authValidator");
const checkValidation = require("../middleware/checkValidation");

const router = express.Router();

router.put("/signup", registerValidator, checkValidation(), signup);
router.post("/login", login);

module.exports = router;
