const createError = require("../utils/createError");
const validateUpdates = require("../utils/validateUpdates");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const User = require("../models/user");

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
