const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.getLandingPage = catchAsync(async (req, res, next) => {
  res.status(200).render('landing_page', {
    title: 'NATOURS',
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get page
  const page = req.query.page || 1; // Default as 1

  // 2) Prepare
  const size = 6;
  const skip = (page - 1) * size;

  // 3) Paginate
  let totalResults;
  if (req.query.search) {
    totalResults = await Tour.find({
      name: { $regex: new RegExp(req.query.search, 'i') },
    }).countDocuments();
  } else {
    totalResults = await Tour.find().countDocuments();
  }

  const totalPages = Math.ceil(totalResults / size);
  
  let tours;
  if (req.query.search) {
    tours = await Tour.find({
      name: { $regex: new RegExp(req.query.search, 'i') },
    })
    .skip(skip)
    .limit(size)
    .exec();;
  } else {
    tours = await Tour.find()
    .skip(skip)
    .limit(size)
    .exec();;
  }

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    page,
    totalPages
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  let isReviewed = true;

  let hasLiked = true;

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

      const like = await Like.findOne({ tour: tour, user: user }); // find User then
      if (!like) hasLiked = false;
    }
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    isReviewed,
    hasLiked,
  });
});

exports.getMyLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ user: req.user.id }).populate('tour').exec();

  res.status(200).render('mylikes', {
    title: 'My Likes',
    likes,
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
    res.status(200).render('mybookings', {
      title: 'My Tours',
      tours,
    });
  }
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('tour')
    .exec();

  if (reviews.length === 0) {
    res.status(200).render('nullbooking', {
      title: 'Write Reviews',
      headLine: `You haven't written any reviews yet!`,
      msg: `Please book a tour, write a review and come back. 🙂`,
    });
  } else {
    res.status(200).render('myreviews', {
      title: 'My Reviews',
      reviews,
    });
  }
});

exports.editReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).render('editreview', {
    title: 'My Reviews',
    review,
  });
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

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // 1) Get page
  const page = req.query.page || 1; // Default as 1

  // 2) Prepare
  const size = 10;
  const skip = (page - 1) * size;

  // 3) Paginate
  const totalResults = await Review.find().countDocuments();
  const totalPages = Math.ceil(totalResults / size);
  const reviews = await Review.find()
    .populate('tour')
    .populate('user')
    // .skip(skip)
    // .limit(size)
    .exec();

  res.status(200).render('admin/reviews', {
    title: 'All reviews',
    reviews,
    page,
    totalPages,
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  // 1) Get page
  const page = req.query.page || 1; // Default as 1

  // 2) Prepare
  const size = 10;
  const skip = (page - 1) * size;

  // 3) Paginate
  const totalResults = await Booking.find().countDocuments();
  const totalPages = Math.ceil(totalResults / size);
  const bookings = await Booking.find()
    .populate('tour')
    .populate('user')
    // .skip(skip)
    // .limit(size)
    .exec();

  res.status(200).render('admin/bookings', {
    title: 'All bookings',
    bookings,
    page,
    totalPages,
  });
});
