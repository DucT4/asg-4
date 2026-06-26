const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const HttpError = require('../utils/httpError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new HttpError(401, 'Unauthorized: missing token');
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new HttpError(401, 'Unauthorized: user not found');
  }

  req.user = user;
  return next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpError(403, 'Forbidden: insufficient permission'));
  }

  return next();
};

module.exports = {
  protect,
  authorize
};
