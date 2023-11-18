const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.get('/users', (req, res) => {
  res.render('admin/users', {
    title: 'Manage Tours',
  });
});

router.get('/users/add', (req, res) => {
  res.render('admin/users_add', {
    title: 'Manage Tours',
  });
});

router.get('/users/:id/edit', (req, res) => {
  res.render('admin/users_edit', {
    title: 'Manage Tours',
  });
});

module.exports = router;
