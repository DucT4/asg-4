const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const HttpError = require('../utils/httpError');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

const buildAuthPayload = (user) => ({
  user: user.toSafeObject(),
  token: signToken(user)
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(400, 'Name, email and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, 'Email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user'
  });

  return apiResponse.created(res, {
    message: 'Signup successfully',
    data: buildAuthPayload(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  return apiResponse.success(res, {
    message: 'Login successfully',
    data: buildAuthPayload(user)
  });
});

const me = asyncHandler(async (req, res) => {
  return apiResponse.success(res, {
    message: 'Get current user successfully',
    data: {
      user: req.user.toSafeObject()
    }
  });
});

module.exports = {
  signup,
  login,
  me
};
