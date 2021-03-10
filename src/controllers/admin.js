const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const { validationResult } = require("express-validator/check");
const errorTypes = require("../config/errorTypes");
const createError = require("../utils/createError");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(errorTypes.NOT_FOUND_ERROR);
    }
    return res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
