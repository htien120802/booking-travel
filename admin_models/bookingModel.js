const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};
const bookingSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      require: [true, 'Booking must have a price.'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
