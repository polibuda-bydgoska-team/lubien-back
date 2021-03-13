const errorTypes = require("../config/errorTypes");

const errorHandler = (error, req, res, next) => {
  switch (error.message) {
    case errorTypes.NOT_AUTHORIZED:
      return res.status(401).send({
        message:
          "The request has not been applied because it lacks valid authentication credentials for the target resource.",
      });
    case errorTypes.NOT_FOUND_ERROR:
      return res
        .status(404)
        .send({ message: "The resource you are looking for was not found." });
    case errorTypes.INVALID_REQUEST:
      return res.status(400).send({ details: error.details });

    default:
      return res.status(500).send({
        message:
          "Something went wrong on our server side. Please try again in a moment.",
        details: error.message,
      });
  }
};

module.exports = errorHandler;
