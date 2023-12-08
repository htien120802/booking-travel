const express = require('express');
const likeController = require('../controllers/likeController');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// Like
router
  .route('/')
  .post(
    authController.restrictTo('user', 'admin'),
    likeController.setTourUserIds,
    likeController.createLike,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    likeController.setTourUserIds,
    likeController.deleteLike,
  );

module.exports = router;
