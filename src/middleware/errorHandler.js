const errorHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).send({ message: message, data: data });
};

module.exports = errorHandler;
