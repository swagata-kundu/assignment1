const mysql = require('mysql');
const boom = require('boom');

class Mysql {
	constructor(config) {
		this.connectionConfig = config;
		this.pool = null;
	}
	connect() {
		return new Promise((resolve, reject) => {
			console.log('Connecting to mysql! 🍺');
			this.pool = mysql.createPool(this.connectionConfig);
			if (!this.pool) {
				return reject(boom.internal('unable to connect to database'));
			}
			console.log('Connected to mysql! 🍺');
			return resolve();
		});

	}

	buildWhereString(filter) {
		if (Object.keys(filter).length != 0) {
			let string = [],
				values = [];
			for (let key in filter) {
				if (filter[key] !== undefined) {
					if(filter[key]===null){
						string.push(` ${key} IS NULL `);
					}else{
						string.push(` ${key} =? `);
						values.push(filter[key]);
					}
				}
			}
			return ({
				condition: `WHERE ${string.join('AND')}`,
				values
			});
		}
		return ({
			condition: '',
			values: []
		});
	}

	insertUserData(data, done) {
		const insertData = data.map(d => {
			return ([d.jobId, d.uid, d.platform]);
		});
		let stringQuery = 'INSERT INTO jobs_analytics (jobId,uid,platform) VALUES ?';
		stringQuery = mysql.format(stringQuery, [insertData]);
		this.pool.query(stringQuery, done);
	}

	totalUids({
		platform,
		jobId
	}, done) {
		jobId = jobId || null;
		const {condition,values}=this.buildWhereString({platform,jobId});
		this.pool.query(`SELECT COUNT(id) totalUids from jobs_analytics ${condition}`, values, (dbError, results) => {
			if (dbError) {
				return done(boom.internal(dbError.message));
			}
			return done(null, results[0].totalUids);
		});
	}

	totalUniqueUids({
		platform,
		jobId
	}, done) {
		jobId = jobId || null;
		const {condition,values}=this.buildWhereString({platform,jobId});
		this.pool.query(`SELECT count(distinct(uid)) as totalUniqueUids FROM jobs_analytics ${condition}`, values, (dbError, results) => {
			if (dbError) {
				return done(boom.internal(dbError.message));
			}
			return done(null, results[0].totalUniqueUids);
		});
	}

	totalCount(jobId, done) {
		jobId = jobId || null;
		const {condition,values}=this.buildWhereString({jobId});
		this.pool.query(`SELECT COUNT(id) totalCount FROM jobs_analytics ${condition}`, values, (dbError, results) => {
			if (dbError) {
				return done(boom.internal(dbError.message));
			}
			return done(null, results[0].totalCount);
		});
	}
	createJob(data, done) {
		this.pool.query('INSERT INTO jobs set ?', data, (dbError, result) => {
			if (dbError) {
				return done(boom.internal(dbError.message));
			}
			return done(null, result.insertId);
		});
	}
	updateJobStatus(jobId, status, done) {
		this.pool.query('UPDATE jobs set status=? where id=?', [status, jobId], done);
	}
	listJobs(done) {
		this.pool.query('SELECT id as jobId,fileName,status FROM jobs order by status desc;', done);
	}
	jobStatus(jobId, done) {
		this.pool.query('SELECT status FROM jobs where id=?', [jobId], (dbError, results) => {
			if (dbError) {
				return done(boom.internal(dbError.message));
			}
			if (results.length === 0) {
				return done(boom.notFound('Invalide Job Id'));
			}
			return done(null, results[0].status);
		});
	}
}

module.exports = Mysql;