const crypto = require("crypto");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const Token = require("../models/token");
const createError = require("../utils/createError");
const sendVerificationEmail = require("../utils/emails/sendVerificationEmail");
const sendResetPswEmail = require("../utils/emails/sendResetPswEmail");
const validateUpdates = require("../utils/validateUpdates");
const bcrypt = require("bcryptjs");

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();

    const products = user.cart.items;

    res.status(200).send(products);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const productSize = req.body.size;
    const productQuantity = req.body.quantity;
    const product = await Product.findById(productId);
    if (!product) {
      createError("Could not find product", 404);
    }
    if (
      (product.quantity.large <= 0 && productSize === "large") ||
      (product.quantity.extraLarge <= 0 && productSize === "extraLarge")
    ) {
      createError("Currently the product is unavailable, we are sorry.", 400);
    }
    if (
      (productSize === "large" && productQuantity > product.quantity.large) ||
      (productSize === "extraLarge" &&
        productQuantity > product.quantity.extraLarge)
    ) {
      createError(
        "The specified quantity of the product is greater than its stock level. We are sorry.",
        400
      );
    }
    const user = await User.findById(req.userId);
    await user.addToCart(product, productSize, productQuantity);
    const updatedUser = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();
    res.status(200).send(updatedUser.cart.items);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCartChangeQuantity = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const productsArray = req.body.productsArray;

    for (const p of productsArray) {
      const product = await Product.findById(p.productId);
      if (!product) {
        createError("Could not find product", 404);
      }
      if (
        (p.size === "large" && p.addValue > product.quantity.large) ||
        (p.size === "extraLarge" && p.addValue > product.quantity.extraLarge)
      ) {
        createError(
          "The specified quantity of the product is greater than its stock level. We are sorry.",
          400
        );
      }
      if (p.addValue) {
        await user.raiseProductQuantityInCart(product, p.size, p.addValue);
      } else {
        await user.reduceProductQuantityInCart(
          product,
          p.size,
          p.subtractValue
        );
      }
    }
    const updatedUser = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();
    res.status(200).send(updatedUser.cart.items);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCartDeleteItem = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const productSize = req.body.size;
    const product = await Product.findById(productId);
    if (!product) {
      createError("Could not find product", 404);
    }
    const user = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();
    await user.removeFromCart(product, productSize);
    res.status(200).send(user.cart.items);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getClearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("cart.items.product")
      .exec();
    await user.clearCart();
    res.status(200).send(user.cart.items);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "purchaser.userId": req.userId }).sort({
      createdAt: -1,
    });
    if (!orders) {
      createError("Could not find orders", 404);
    }
    res.status(200).send(orders);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.find({
      _id: req.params.orderId,
      "purchaser.userId": req.userId,
    });
    if (!order) {
      createError("Could not find order", 404);
    }
    res.status(200).send(order);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).send({
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName || "",
      address: {
        street: user.address.street,
        houseNumber: user.address.houseNumber,
        addressAdditionalInfo: user.address.addressAdditionalInfo || "",
        city: user.address.city,
        county: user.address.county || "",
        postCode: user.address.postCode,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.putEditUserDetails = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "phone",
      "firstName",
      "lastName",
      "companyName",
      "address",
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

    const user = await User.findById(req.userId);

    user.phone = phone;
    user.firstName = firstName;
    user.lastName = lastName;
    user.companyName = companyName;
    user.address.street = street;
    user.address.houseNumber = houseNumber;
    user.address.addressAdditionalInfo = addressAdditionalInfo;
    user.address.city = city;
    user.address.county = county;
    user.address.postCode = postCode;

    await user.save();

    res.status(200).send({
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName || "",
      address: {
        street: user.address.street,
        houseNumber: user.address.houseNumber,
        addressAdditionalInfo: user.address.addressAdditionalInfo || "",
        city: user.address.city,
        county: user.address.county || "",
        postCode: user.address.postCode,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.putEditEmail = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email"];
    const areUpdatesValid = validateUpdates(updates, allowedUpdates);
    if (!areUpdatesValid.isOperationValid) {
      createError("Can't update these fields.", 422, areUpdatesValid.error);
    }

    const user = await User.findById(req.userId);

    user.email = req.body.email;
    user.isVerified = false;

    await user.save();

    const updatedUser = await User.findById(req.userId);

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    sendVerificationEmail(updatedUser.email, token.token);

    res.status(200).send({
      newEmail: updatedUser.email,
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

exports.getConfirmEmail = async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      createError(
        "Your verification link may have expired. Please click on resend to verify your email.",
        400
      );
    }

    const user = await User.findOne({
      _id: token.userId,
      email: req.params.email,
    });

    if (!user) {
      createError(
        "Your verification link may have expired. Please click on resend to verify your email.",
        400
      );
    }

    user.isVerified = true;
    await user.save();

    await token.delete();

    res
      .status(200)
      .send({ message: "Your account has been successfully verified!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postResendConfirmationEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      createError(
        "If the address you entered is correct, we will send an email with a link to activate your account. Link will expire after one day.",
        401
      );
    }

    if (user.isVerified) {
      return res
        .status(200)
        .send("This account has already been verified. Please log in.");
    }

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    sendVerificationEmail(user.email, token.token);

    return res.status(200).send({
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

exports.putChangePassword = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "actualPassword",
      "newPassword",
      "confirmNewPassword",
    ];
    const areUpdatesValid = validateUpdates(updates, allowedUpdates);
    if (!areUpdatesValid.isOperationValid) {
      createError("Can't update these fields.", 422, areUpdatesValid.error);
    }

    const user = await User.findById(req.userId);

    const { actualPassword, newPassword } = req.body;

    const isActualPasswordValid = await bcrypt.compare(
      actualPassword,
      user.password
    );
    if (!isActualPasswordValid) {
      createError("Wrong current password", 400);
    }

    const isPasswordsSame = await bcrypt.compare(newPassword, user.password);
    if (isPasswordsSame) {
      createError("New password must be different, than current one", 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedNewPassword;

    await user.save();

    res.status(200).send({ message: "New password is set" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      createError(
        "If the address you entered is correct, we will send an email with a link to reset your password. Link will expire after one hour.",
        200
      );
    }

    const token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.delete();
    }

    const linkToken = crypto.randomBytes(32).toString("hex");
    const hashToken = await bcrypt.hash(linkToken, 12);

    const expiresTokenDate = new Date();

    const resetToken = new Token({
      userId: user._id,
      token: hashToken,
      expireAt: expiresTokenDate.setHours(expiresTokenDate.getHours() + 1),
    });

    await resetToken.save();

    sendResetPswEmail(user.email, user._id, linkToken);

    return res.status(200).send({
      message:
        "If the address you entered is correct, we will send an email with a link to reset your password. Link will expire after one hour.",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postResetPasswordToken = async (req, res, next) => {
  try {
    const resetToken = await Token.findOne({ userId: req.params.userId });
    if (!resetToken) {
      createError("Invalid or expired password reset link!", 401);
    }

    const isValid = await bcrypt.compare(req.params.token, resetToken.token);
    if (!isValid) {
      createError("Invalid or expired password reset link!", 401);
    }

    const newHashedPwd = await bcrypt.hash(req.body.password, 12);

    await User.updateOne(
      { _id: req.params.userId },
      { $set: { password: newHashedPwd } },
      { new: true }
    );

    await resetToken.delete();

    return res.status(200).send({
      message:
        "You have successfully reset your password. You can go to login.",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
