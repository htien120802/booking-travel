const mongoose = require('mongoose');
const Tour = require('./tourModel');

const likeSchema = new mongoose.Schema(
  {
    like: {
      type: Boolean,
      default: true,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Like must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Like must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

likeSchema.index({ tour: 1, user: 1 }, { unique: true });

likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

likeSchema.statics.calcTotalLikes = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nLike: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      likeQuantity: stats[0].nLike,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      likeQuantity: 0,
    });
  }
};

likeSchema.post('save', function () {
  // this points to current review
  this.constructor.calcTotalLikes(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
likeSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  console.log(this.r);
  next();
});

likeSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcTotalLikes(this.r.tour);
});


const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
