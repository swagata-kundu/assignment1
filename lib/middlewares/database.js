const db = require('../db');

module.exports = () => (req, res, next) => {
	res.locals.db=db.backEnd;
	return next();
};