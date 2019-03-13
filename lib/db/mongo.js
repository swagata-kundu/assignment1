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
				console.log('Connected to mongodb! 🍺');
				this.client = client.db(this.connectionConfig.database);
				return resolve();
			}).catch(error => reject(boom.internal(error.message)));
		});
	}

	insertUserData(data, done) {
		const deviceCollection = this.client.collection('jobs_analytics');
		deviceCollection.insertMany(data, done);
	}

	totalUids({
		platform,
		jobId
	}, done) {
		jobId = jobId || null;
		const deviceCollection = this.client.collection('jobs_analytics');
		deviceCollection.countDocuments({
			platform,
			jobId
		}, done);
	}


	totalUniqueUids({
		platform,
		jobId
	}, done) {
		jobId = jobId || null;
		const deviceCollection = this.client.collection('jobs_analytics');
		deviceCollection.aggregate([{
			$match: {
				'platform': platform,
				jobId
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
			if (error) {
				return done(error);
			}
			if (!result.length) {
				return done(null, 0);
			}
			return done(null, result[0].totalUniqueUids);
		});
	}

	totalCount(jobId, done) {
		jobId = jobId || null;
		const deviceCollection = this.client.collection('jobs_analytics');
		deviceCollection.countDocuments({jobId}, done);
	}
}

module.exports = Mongo;