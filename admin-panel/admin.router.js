const { buildRouter } = require('admin-bro-expressjs');

const buildAdminRouter = (admin) => buildRouter(admin);

module.exports = buildAdminRouter;
