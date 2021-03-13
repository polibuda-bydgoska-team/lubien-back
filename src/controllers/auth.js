const { validationResult } = require("express-validator");
const errorTypes = require("../config/errorTypes");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw createError(errorTypes.INVALID_REQUEST, {
      message: "Validation failed, entered data is incorrect.",
      errors: validationErrors.array(),
    });
  }
  const {
    email,
    password,
    phone,
    firstName,
    lastName,
    companyName,
    street,
    houseNumber,
    addressAditionalInfo,
    city,
    county,
    postCode,
  } = req.body;

  try {
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
        addressAditionalInfo,
        city,
        county,
        postCode,
      },
    });

    await user.save();

    const userToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      authConfig
    );

    return res.status(201).send({ token: userToken });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw createError(
        errorTypes.INVALID_REQUEST,
        "A user with this email could not be found"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw createError(errorTypes.INVALID_REQUEST, "Wrong password.");
    }

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET,
      authConfig
    );

    res.status(200).send({
      token: token,
      expiresIn: process.env.TOKEN_EXPIRES_IN,
      userId: foundUser._id.toString(),
      email: foundUser.email,
    });
  } catch (error) {
    next(error);
  }
};
