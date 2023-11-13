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

const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
