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

    console.log(req.expirationDate);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      authConfig
    );

    const decodedToken = jwt.decode(token, { complete: true });
    const expirationDateInJWT = decodedToken.payload.exp;
    const expirationDate = new Date(expirationDateInJWT * 1000);

    return res.status(201).send({
      token: token,
      expirationDate: expirationDate,
      userId: user._id.toString(),
    });
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

    const decodedToken = jwt.decode(token, { complete: true });
    const expirationDateInJWT = decodedToken.payload.exp;
    const expirationDate = new Date(expirationDateInJWT * 1000);

    res.status(200).send({
      token: token,
      expirationDate: expirationDate,
      userId: foundUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};
