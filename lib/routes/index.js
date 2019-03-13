const routes = require('express').Router();

routes.use(require('../middlewares/database')());
routes.get('/platform', require('./platform'));
routes.post('/analytics', require('./uploads'));
routes.get('/analytics', require('./listJobs'));
routes.get('/analytics/status/:jobId', require('./jobStatus'));
routes.get('/analytics/:jobId', require('./jobAnalytics'));


module.exports = routes;