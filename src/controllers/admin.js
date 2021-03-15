const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const { validationResult } = require("express-validator/check");
const validateUpdates = require("../utils/validateUpdates");
const createError = require("../utils/createError");

exports.getUsers = async (req, res, next) => {
  try {
    const usersNumber = await User.countDocuments({});
    const users = await User.find({}).populate("cart").exec();
    if (!users) {
      createError("Could not find users", 404);
    }
    return res.status(200).set("X-Total-Count", usersNumber).send(users);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart").exec();
    if (!user) {
      createError("Could not find user", 404);
    }
    return res.status(200).set("X-Total-Count", "1").send(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const ordersNumber = await Order.countDocuments({});
    const orders = await Order.find({}).populate("userId").exec();
    if (!orders) {
      createError("Could not find orders", 404);
    }
    return res.status(200).set("X-Total-Count", ordersNumber).send(users);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId")
      .exec();
    if (!order) {
      createError("Could not find order", 404);
    }
    return res.status(200).set("X-Total-Count", "1").send(order);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const productsNumber = await Product.countDocuments({});
    const products = await Product.find({});
    if (!products) {
      createError("Could not find products", 404);
    }
    return res.status(200).set("X-Total-Count", productsNumber).send(products);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      createError("Could not find product", 404);
    }
    return res.status(200).set("X-Total-Count", "1").send(product);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    createError("Validation failed, entered data is incorrect.", 422);
  }

  // if (!req.files) {
  //   throw createError(errorTypes.INVALID_REQUEST, {
  //     message: "No images provided.",
  //   });
  // }
  // const imagesURL = req.files.path.replace("\\", "/");

  const {
    title,
    price,
    size,
    quantity,
    mainNotes,
    scentInspiration,
    location,
    scentProfile,
    topNotes,
    heartNotes,
    baseNotes,
    description,
    seriesName,
    imagesURL,
  } = req.body;

  const product = new Product({
    title,
    price,
    size,
    quantity,
    mainNotes,
    scentInspiration,
    location,
    scentProfile,
    topNotes,
    heartNotes,
    baseNotes,
    description,
    seriesName,
    imagesURL,
  });

  try {
    await product.save();
    return res.status(201).send({
      message: "Product added succesfully.",
      product: product,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    createError("Validation failed, entered data is incorrect.", 422);
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "price",
    "size",
    "quantity",
    "mainNotes",
    "scentInspiration",
    "location",
    "scentProfile",
    "topNotes",
    "heartNotes",
    "baseNotes",
    "description",
    "seriesName",
    "imagesURL",
  ];
  const areUpdatesValid = validateUpdates(updates, allowedUpdates);
  if (!areUpdatesValid.isOperationValid) {
    createError("Can't updates this fields", 422);
  }

  // let imagesURL = req.body.imagesURL;
  // if (req.files) {
  //   imagesURL = req.file.path.replace("\\", "/");
  // }
  // if (!imagesURL) {
  //   throw createError(errorTypes.INVALID_REQUEST, {
  //     message: "No images provided.",
  //   });
  // }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
      }
    );

    if (!product) {
      createError("Could not find product", 404);
    }

    return res.status(200).send({
      message: "Product edited succesfully.",
      product: product,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      createError("Could not find product", 404);
    }

    return res.status(200).send({
      message: "Product was deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
