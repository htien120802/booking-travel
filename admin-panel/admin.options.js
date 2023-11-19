const AdminBro = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');

const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

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
                listProperties: ['_id', 'name', 'email', 'role', 'active'],
                filterProperties: ['_id', 'name', 'email', 'role', 'active'],
                editProperties: ['name', 'email', 'role', 'active', 'passwordChangedAt', 'passwordResetExpires'],
                showProperties: ['_id', 'name', 'email', 'role', 'active', 'passwordChangedAt', 'passwordResetExpires']
            }
        }
    ],
    branding: {
        logo: 'https://michaeljamie.github.io/advanced-css-sass-less-course/Natours/img/Natours-Logo-green.png',
        companyName: 'Natours',
    }
};

module.exports = options;