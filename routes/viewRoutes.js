const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use();

router.get('/', authController.isLoggedIn, viewController.getLandingPage);

router.get('/all-tours', authController.isLoggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/signup', authController.isLoggedIn, viewController.getSingupForm);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours,
);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get('/my-likes', authController.protect, viewController.getMyLikes);
router.get(
  '/my-reviews/:id/edit',
  authController.protect,
  viewController.editReview,
);
router.get('/forget-password', viewController.getForgetPasswordForm);
router.get('/reset-password/:resetToken', viewController.getResetPasswordForm);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);

module.exports = router;
