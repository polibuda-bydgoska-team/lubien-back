const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const createError = require("../utils/createError");
const { validationResult } = require("express-validator/check");
const validateUpdates = require("../utils/validateUpdates");

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
    const user = await User.findById(req.userId);
    await user.addToCart(product, productSize, productQuantity);
    res.status(200).send(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postIncreaseItemInCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const productsArray = req.body.productsArray;
    productsArray.forEach((p) => {
      const product = await Product.findById(p.productId);
      if (!product) {
      createError("Could not find product", 404);
      }
      await user.raiseProductQuantityInCart(
        product,
        p.size,
        p.addValue
      );
    });
    res.status(200).send({message: "Quantitiy changed"});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postReduceItemInCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const productsArray = req.body.productsArray;
    productsArray.forEach((p)=>{
      const product = await Product.findById(p.productId);
      if (!product) {
      createError("Could not find product", 404);
      }
      await user.reduceProductQuantityInCart(
        product,
        p.size,
        p.subtractValue
      );
    })
    res.status(200).send({message: "Quantitiy changed"}));
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
    const user = await User.findById(req.userId);
    await user.removeFromCart(product, productSize);
    res.status(200).send(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getClearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    await user.clearCart();
    res.status(200).send({ message: "Cart cleared" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.userId });
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
      "user.userId": req.userId,
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
      createError("Can't updates this fields", 422, areUpdatesValid.error);
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

    res.status(200).send("User details updated");
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.putEditEmail = async (req, res, next) => {
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
    const allowedUpdates = ["email"];
    const areUpdatesValid = validateUpdates(updates, allowedUpdates);
    if (!areUpdatesValid.isOperationValid) {
      createError("Can't updates this fields", 422, areUpdatesValid.error);
    }

    const user = await User.findById(req.userId);

    user.email = req.body.email;

    await user.save();

    res.status(200).send("User email updated");
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
