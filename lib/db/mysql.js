const mysql = require('mysql');
const boom=require('boom');

class Mysql {
	constructor(config) {
		this.connectionConfig = config;
		this.pool = null;
	}
	connect() {
		return new Promise((resolve,reject)=>{
			console.log('Connecting to mysql! 🍺');
			this.pool = mysql.createPool(this.connectionConfig);
			if (!this.pool) {
				return reject(new boom.internal('unable to connect to database'));
			}
			return resolve();
		});
		
	}

	insert(data, done) {
		const insertData=data.map(d=>{
			return ([d.uid,d.platform]);
		});
		let stringQuery = 'INSERT INTO devices (uid,platform) VALUES ?';
		stringQuery = mysql.format(stringQuery, [insertData]);
		this.pool.query(stringQuery, done);
	}

	totalUids(platform, done){
		this.pool.query('SELECT COUNT(id) totalUids from devices where platform=?',[platform],(dbError,results)=>{
			if(dbError){
				return done(new boom.internal(dbError.message));
			}
			return done(null,results[0].totalUids);
		});
	}

	totalUniqueUids(platform, done){
		this.pool.query('SELECT count(distinct(uid)) as totalUniqueUids FROM devices where platform=?',[platform],(dbError,results)=>{
			if(dbError){
				return done(new boom.internal(dbError.message));
			}
			return done(null,results[0].totalUniqueUids);
		});
	}

	totalCount(done){
		this.pool.query('SELECT COUNT(id) totalCount from devices;',(dbError,results)=>{
			if(dbError){
				return done(new boom.internal(dbError.message));
			}
			return done(null,results[0].totalCount);
		});
	}
}

module.exports = Mysql;