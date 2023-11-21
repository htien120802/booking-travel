const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  let isReviewed = true;

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  } else {
    const user = await findLoggedInUser(req);
    if (user) {
      const booking = await Booking.findOne({ tour: tour, user: user }); // find User then
      if (booking) {
        const review = await Review.findOne({ tour: tour, user: user });
        if (!review) isReviewed = false;
      }
    }
  }

  console.log(isReviewed);
  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    isReviewed,
  });
});

exports.getSingupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'create your account!',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getForgetPasswordForm = (req, res) => {
  res.status(200).render('forgetpassword', {
    title: 'Forget password',
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('resetpassword', {
    title: 'Forget password',
    resetToken: req.params.resetToken,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  if (bookings.length === 0) {
    res.status(200).render('nullbooking', {
      title: 'Book Tours',
      headLine: `You haven't booked any tours yet!`,
      msg: `Please book a tour and come back. 🙂`,
    });
  } else {
    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
  }
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // 1) Get page
  const page = req.query.page || 1; // Default as 1

  // 2) Prepare
  const size = 10;
  const skip = (page - 1) * size;

  // 3) Paginate
  const totalResults = await User.find({
    role: { $ne: 'admin' },
  }).countDocuments();
  const totalPages = Math.ceil(totalResults / size);
  const users = await User.find({ role: { $ne: 'admin' } })
    .skip(skip)
    .limit(size)
    .exec();

  res.status(200).render('admin/users', {
    title: 'All Users',
    users,
    page,
    totalPages,
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const userEdit = await User.findById({ _id: req.params.id });
  res.status(200).render('admin/users_edit', {
    title: 'All Users',
    userEdit,
  });
});

const findLoggedInUser = async (req) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return null;
      }
      return currentUser;
    } catch (error) {
      throw error;
    }
  }
};
