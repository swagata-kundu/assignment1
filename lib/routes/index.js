const routes = require('express').Router();

routes.use(require('../middlewares/database')());
routes.get('/platform', require('./platform'));

module.exports = routes;