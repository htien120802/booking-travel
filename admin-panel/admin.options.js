const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

const {
  after: uploadAfterHook,
  before: uploadBeforeHook,
} = require('./actions/upload-image.hook');

AdminBro.registerAdapter(AdminBroMongoose);

const options = {
  rootPath: '/admin-panel',
  resources: [
    { resource: Tour },
    { resource: Booking },
    { resource: Review },
    {
      resource: User,
      options: {
        properties: {
          passwordChangedAt: {
            isVisible: false,
          },
          passwordConfirm: {
            isVisible: false,
          },
          passwordResetToken: {
            isVisible: false,
          },
          passwordResetExpires: {
            isVisible: false,
          },
          photo: {
            isVisible: false,
          },
          uploadImage: {
            isVisible: {
              edit: true,
              show: true,
              list: true,
              filter: false,
            },
            components: {
              edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/upload-image.list.tsx'),
              show: AdminBro.bundle('./components/upload-image.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            after: async (response, request, context) =>
              uploadAfterHook(response, request, context),
            before: async (request, context) =>
              uploadBeforeHook(request, context),
          },
          edit: {
            after: async (response, request, context) =>
              uploadAfterHook(response, request, context),
            before: async (request, context) =>
              uploadBeforeHook(request, context),
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
  ],
  branding: {
    logo: 'https://michaeljamie.github.io/advanced-css-sass-less-course/Natours/img/Natours-Logo-green.png',
    companyName: 'Natours',
  },
};

module.exports = options;
