// import express from 'express';
// import * as reviewController from './../controllers/reviewController.js';
// import * as authController from './../controllers/authController.js';

// const router = express.Router({ mergeParams: true });

// // POST /tour/32434fs35/reviews
// // GET /tour/32434fs35/reviews
// // POST /reviews

// router.use(authController.protect);

// // user review routes
// router
//   .route('/')
//   .get(reviewController.getAllReviews)
//   .post(
//     authController.restrictTo('user'),
//     reviewController.setTourUserIds,
//     reviewController.createReview,
//   );

// router
//   .route('/:id')
//   .get(reviewController.getlReview)
//   .patch(
//     authController.restrictTo('user', 'admin'),
//     reviewController.updateReview,
//   )
//   .delete(
//     authController.restrictTo('user', 'admin'),
//     reviewController.deleteReview,
//   );

// export default router;

const express = require('express');
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user', 'admin'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
