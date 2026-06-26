const apiResponse = require('../utils/apiResponse');

const notFoundHandler = (req, res) => {
  return apiResponse.fail(res, {
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || (process.env.NODE_ENV === 'production' ? undefined : err.stack);

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Unauthorized: invalid or expired token';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((item) => item.message);
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value';
    errors = err.keyValue;
  }

  return apiResponse.fail(res, {
    statusCode,
    message,
    errors
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
