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

const {
  after: uploadMultipleAfterHook,
  before: uploadMultipleBeforeHook,
} = require('./actions/upload-multiple-images.hook');

AdminBro.registerAdapter(AdminBroMongoose);

const options = {
  rootPath: '/admin-panel',
  resources: [
    {
      resource: User,
      options: {
        sort: {
          sortBy: 'active',
          direction: 'desc',
        },
        listProperties: [
          '_id',
          'uploadImage',
          'name',
          'email',
          'role',
          'active',
        ],
        properties: {
          role: {
            availableValues: [
              { value: 'user', label: 'User' },
              { value: 'guide', label: 'Guide' },
              { value: 'lead-guide', label: 'Lead Guide' },
              { value: 'admin', label: 'Admin' },
            ],
          },
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
              edit: AdminBro.bundle('./components/users/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/users/upload-image.list.tsx'),
              show: AdminBro.bundle('./components/users/upload-image.list.tsx'),
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
        },
      },
    },
    {
      resource: Tour,
      options: {
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
        listProperties: [
          '_id',
          'uploadCover',
          'name',
          'duration',
          'maxGroupSize',
          'difficulty',
          'secretTour',
          'createdAt',
        ],
        editProperties: [
          'name',
          'duration',
          'maxGroupSize',
          'difficulty',
          'secretTour',
          'price',
          'priceDiscount',
          'summary',
          'description',
          'uploadCover',
          'uploadImages',
          'secretTour',
          // 'startLocation',
          'locations',
          'guides',
        ],
        properties: {
          description: {
            type: 'richtext',
            props: {
              rows: 20,
            },
          },
          slug: {
            isVisible: false,
          },
          createdAt: {
            isVisible: false,
          },
          ratingsAverage: {
            isVisible: false,
          },
          ratingsQuantity: {
            isVisible: false,
          },
          difficulty: {
            availableValues: [
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'difficult', label: 'Difficult' },
            ],
          },
          imageCover: {
            isVisible: false,
          },
          images: {
            isVisible: false,
          },
          uploadCover: {
            isVisible: {
              edit: true,
              show: true,
              list: true,
              filter: false,
            },
            components: {
              edit: AdminBro.bundle('./components/tours/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/tours/upload-image.list.tsx'),
              show: AdminBro.bundle('./components/tours/upload-image.list.tsx'),
            },
          },
          uploadImages: {
            isVisible: {
              edit: true,
              show: false,
              list: false,
              filter: false,
            },
            components: {
              edit: AdminBro.bundle(
                './components/tours/upload-multiple-images.edit.tsx',
              ),
            },
          },
        },
        actions: {
          new: {
            after: async (response, request, context) =>
              uploadMultipleAfterHook(response, request, context),
            before: async (request, context) =>
              uploadMultipleBeforeHook(request, context),
          },
          edit: {
            after: async (response, request, context) =>
              uploadMultipleAfterHook(response, request, context),
            before: async (request, context) =>
              uploadMultipleBeforeHook(request, context),
          },
        },
      },
    },
    { resource: Booking },
    {
      resource: Review,
      options: {
        properties: {
          review: {
            type: 'richtext',
            props: {
              rows: 20,
            },
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
