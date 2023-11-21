// import Review from './../models/reviewModel.js';
// import catchAsync from './../utils/catchAsync.js';
// // import * as factory from './handlerFactory.js';

// export const setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

// export const getAllReviews = factory.getAll(Review);
// export const getlReview = factory.getOne(Review);
// export const createReview = factory.createOne(Review);
// export const updateReview = factory.updateOne(Review);
// export const deleteReview = factory.deleteOne(Review);

const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// exports.createReviewOnTour = catchAsync(async (req, res, next) => {
//   const tour = req.params.id;
//   const user = req.user.id;
//   if (!req.body.review || !req.body.rating)
//     next(new AppError('Review or rating is empty'));

//   const review = await Review.create({
//     rating: req.body.rating,
//     review: req.body.review,
//     tour: tour,
//     user: user,
//   });

//   res.json({
//     status: 'success',
//     data: review,
//   });
// });

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
