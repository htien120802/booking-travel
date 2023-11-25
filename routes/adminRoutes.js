const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.get('/users', viewController.getAllUsers);

router.get('/users/add', (req, res) => {
  res.render('admin/users_add', {
    title: 'Manage Tours',
  });
});

router.get('/users/:id/edit', viewController.getUserById);

router.get('/reviews', (req, res) => {
  res.render('admin/reviews', {
    title: 'Manage Reviews',
  });
});

router.get('/bookings', (req, res) => {
  res.render('admin/bookings', {
    title: 'Manage Bookings',
  });
});

module.exports = router;
