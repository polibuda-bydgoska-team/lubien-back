const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const { validationResult } = require("express-validator/check");
const validateUpdates = require("../utils/validateUpdates");
const errorTypes = require("../config/errorTypes");
const createError = require("../utils/createError");

exports.getUsers = async (req, res, next) => {
  try {
    const usersNumber = await User.countDocuments({});
    const users = await User.find({}).populate("cart").exec();
    if (!users) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", usersNumber)
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(users);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart").exec();
    if (!user) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", "1")
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(user);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const ordersNumber = await Order.countDocuments({});
    const orders = await Order.find({}).populate("userId").exec();
    if (!orders) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", ordersNumber)
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(users);
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId")
      .exec();
    if (!order) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", "1")
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(order);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const productsNumber = await Product.countDocuments({});
    const products = await Product.find({});
    if (!products) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", productsNumber)
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(products);
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res
      .status(200)
      .set("X-Total-Count", "1")
      .set("Access-Control-Expose-Headers", "X-Total-Count")
      .send(product);
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw createError(errorTypes.INVALID_REQUEST, {
      message: "Validation failed, entered data is incorrect.",
      errors: validationErrors.array(),
    });
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
    next(error);
  }
};

exports.editProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw createError(errorTypes.INVALID_REQUEST, {
      message: "Validation failed, entered data is incorrect.",
      errors: validationErrors.array(),
    });
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
    throw new Error(errorTypes.INVALID_REQUEST);
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
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }

    return res.status(200).send({
      message: "Product edited succesfully.",
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }

    return res.status(200).send({
      message: "Product was deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    next(error);
  }
};
