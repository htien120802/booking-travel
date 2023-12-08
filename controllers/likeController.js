const Like = require('../models/likeModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createLike = factory.createOne(Like);
exports.deleteLike = catchAsync(async (req, res, next) => {
  // Find
  const tour = await Tour.findById(req.body.tour);
  const user = await User.findById(req.body.user);

  // Check existence
  if (!tour) {
    return next(new AppError('Tour found', 404));
  }

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Find
  const doc = await Like.findOneAndDelete({ tour: tour._id, user: user._id });

  if (!doc) {
    return next(new AppError("This document hasn't been liked yet", 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
