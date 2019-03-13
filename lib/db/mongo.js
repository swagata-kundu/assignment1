const MongoClient = require('mongodb').MongoClient;
const boom = require('boom');

class Mongo {
	constructor(config) {
		this.connectionConfig = config;
		this.client = null;
	}
	connect() {
		return new Promise((resolve, reject) => {
			console.log('Connecting to mongodb! 🍺');
			MongoClient.connect(this.connectionConfig.url, {
				useNewUrlParser: true
			}).then(client => {
				this.client = client.db(this.connectionConfig.database);
				return resolve();
			}).catch(error => reject(boom.internal(error.message)));
		});

	}

	insert(data, done) {
		const deviceCollection = this.client.collection('devices');
		deviceCollection.insertMany(data, done);
	}

	totalUids(platform, done) {
		const deviceCollection = this.client.collection('devices');
		deviceCollection.countDocuments({
			platform
		}, done);
	}

	totalUniqueUids(platform, done) {
		const deviceCollection = this.client.collection('devices');
		deviceCollection.aggregate([{
			$match: {
				'platform': platform
			}
		}, {
			$group: {
				'_id': '$uid',
			}
		},
		{
			$group: {
				_id: null,
				totalUniqueUids: {
					$sum: 1
				}
			}
		}
		]).toArray((error, result) => {
			if(error){
				return done(error);
			}
			if(!result.length){
				return done(null,0);
			}
			return done(null,result[0].totalUniqueUids);
		});
	}

	totalCount(done) {
		const deviceCollection = this.client.collection('devices');
		deviceCollection.countDocuments({}, done);
	}
}

module.exports = Mongo;