const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const User = require('../admin_models/userModel');
const Tour = require('../admin_models/tourModel');
const Review = require('../admin_models/reviewModel');
const Booking = require('../admin_models/bookingModel');
const Error = require('../admin_models/errorModel');

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
        showProperties: [
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
          email: {
            type: 'email',
          },
          password: {
            type: 'password',
            isVisible: {
              edit: true,
              show: false,
              list: false,
              filter: false,
            },
          },
          passwordConfirm: {
            type: 'password',
            isVisible: {
              edit: true,
              show: false,
              list: false,
              filter: false,
            },
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
    {
      resource: Review,
      options: {
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
        actions: {
          new: {
            isAccessible: false,
            isVisible: false,
          },
        },
        properties: {
          review: {
            type: 'richtext',
            props: {
              rows: 20,
            },
          },
          rating: {
            availableValues: [
              { value: '1', label: '★' },
              { value: '2', label: '★★' },
              { value: '3', label: '★★★' },
              { value: '4', label: '★★★★' },
              { value: '5', label: '★★★★★' },
            ],
          },
        },
      },
    },
    {
      resource: Booking,
      options: {
        listProperties: ['_id', 'tour', 'user', 'price', 'paid', 'createdAt'],
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
        actions: {
          new: {
            isAccessible: false,
            isVisible: false,
          },
        },
      },
    },
    {
      resource: Error,
      options: {
        listProperties: ['_id', 'status', 'message', 'stack'],
        parent: {
          name: 'Errors',
        },
        actions: {
          new: {
            isAccessible: false,
            isVisible: false,
          },
          edit: {
            isAccessible: false,
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
