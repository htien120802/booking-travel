const path = require('path');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const likeRouter = require('./routes/likeRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const AdminBro = require('admin-bro');
const options = require('./admin-panel/admin.options');
const buildAdminRouter = require('./admin-panel/admin.router');
const admin = new AdminBro(options);
const router = buildAdminRouter(admin);

const app = express();

app.set('view engine', 'pug');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'admin'),
]);

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set CSP

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "font-src 'self' https://js.stripe.com https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  );
  return next();
});

// Development logging
if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'likeQuantity',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/bookings', bookingRouter);

const authController = require('./controllers/authController');
app.use(
  admin.options.rootPath,
  authController.protect,
  authController.restrictTo('admin'),
  router,
);

app.use('/public/img', express.static('public/img'));
app.use('/public/img/users', express.static('public/img/users'));
app.use('/public/img/tours', express.static('public/img/tours'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Add moment
app.locals.moment = require('moment');

app.use(globalErrorHandler);

module.exports = app;
