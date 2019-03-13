const config = require('config');

const backends = {
	'mysql':require('./mysql'),
	'mongodb':require('./mongo')
};

class Db {
	constructor(dbConfig) {
		const {
			db_type,
			config
		} = dbConfig;
		this.backEnd = null;
		if (['mysql', 'mongodb'].findIndex(d => d === db_type) === -1) {
			throw new Error('Invalid db_type');
		}
		this.backEnd = new backends[db_type](config);
	}
	connect(){
		return this.backEnd.connect();
	}
}

module.exports = new Db(config.get('db_config'));