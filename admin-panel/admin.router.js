const { buildRouter } = require('admin-bro-expressjs')

const buildAdminRouter = (admin) => {
    return buildRouter(admin);
}

module.exports = buildAdminRouter