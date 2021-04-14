const crypto = require("crypto");

const { validationResult } = require("express-validator");
const createError = require("../utils/createError");
const validateUpdates = require("../utils/validateUpdates");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const User = require("../models/user");
const Token = require("../models/token");

exports.signup = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      createError(
        "Validation failed, entered data is incorrect.",
        422,
        validationErrors.array()
      );
    }

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
      createError("Can't updates this fields", 422, areUpdatesValid.error);
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

    emailBody = `<p>Please verify your account by clicking this <b><a href="http://${req.headers.host}/user/confirmation/${user.email}/${token.token}">link</a>.<b></p>`;

    sendEmail(user.email, "Account Verification Link", emailBody);

    return res
      .status(201)
      .send(
        "The verification link has been sent! If you don't see it, check spam or click resend. It will be expire after one day."
      );
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
      createError("Can't updates this fields", 422, areUpdatesValid.error);
    }

    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      createError("No user found with this email", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      createError("Wrong password", 400);
    }

    if (!foundUser.isVerified) {
      createError(
        "Your email has not been verified. Please click on resend.",
        401
      );
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
      userRole: foundUser.role,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
