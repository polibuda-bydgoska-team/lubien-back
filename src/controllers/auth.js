const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const createError = require("../utils/createError");
const validateUpdates = require("../utils/validateUpdates");
const sendVerificationEmail = require("../utils/emails/sendVerificationEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const User = require("../models/user");
const Token = require("../models/token");

exports.signup = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "email",
      "password",
      "confirmPassword",
      "phone",
      "firstName",
      "lastName",
      "address",
      "companyName",
      "street",
      "houseNumber",
      "addressAdditionalInfo",
      "city",
      "county",
      "postCode",
    ];
    const areUpdatesValid = validateUpdates(updates, allowedUpdates);
    if (!areUpdatesValid.isOperationValid) {
      createError("Can't update these fields.", 422, areUpdatesValid.error);
    }

    const {
      email,
      password,
      phone,
      firstName,
      lastName,
      companyName,
      address: {
        street,
        houseNumber,
        addressAdditionalInfo,
        city,
        county,
        postCode,
      },
    } = req.body;

    const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPwd,
      phone,
      firstName,
      lastName,
      companyName,
      address: {
        street,
        houseNumber,
        addressAdditionalInfo,
        city,
        county,
        postCode,
      },
    });

    await user.save();

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    sendVerificationEmail(user.email, token.token);

    return res.status(201).send({
      message:
        "If the address you entered is correct, we will send an email with a link to activate your account. Link will expire after one day.",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "password"];
    const areUpdatesValid = validateUpdates(updates, allowedUpdates);
    if (!areUpdatesValid.isOperationValid) {
      createError("Can't update these fields", 422, areUpdatesValid.error);
    }

    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      createError("Wrong password or/and email.", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!foundUser.isVerified) {
      createError(
        "Your email has not been verified. Check if you have a verification email in your e-mail box. If you don't have it - click resend.",
        401,
        foundUser.email
      );
    }

    if (!isPasswordValid) {
      createError("Wrong password or/and email.", 400);
    }

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET,
      authConfig
    );

    const decodedToken = jwt.decode(token, { complete: true });
    const expirationDateInJWT = decodedToken.payload.exp;
    const expirationDate = new Date(expirationDateInJWT * 1000);

    res.status(200).send({
      token: token,
      expirationDate: expirationDate,
      userId: foundUser._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
