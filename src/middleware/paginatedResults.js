const createError = require("../utils/createError");

function paginatedResults(model) {
  return async (req, res, next) => {
    const resources = await model.find({});
    if (!resources) {
      createError("Could not find resources.", 404);
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const documentsAmount = await model.countDocuments().exec();

    const results = { documentsAmount: documentsAmount };

    if (endIndex < documentsAmount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      error.message = "Pagination has failed.";
      error.statusCode = 500;
      next(error);
    }
  };
}

module.exports = paginatedResults;
