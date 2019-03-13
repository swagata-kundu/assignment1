const Busboy = require('busboy');
const boom=require('boom');
const async = require('async');
const fs = require('fs');
const os = require('os');
const path = require('path');

const Import=require('../../lib/import');

const uploadFile = (req, res, next) => {
	const busboy = new Busboy({
		headers: req.headers
	});
	let saveTo, fileName;

	const db=res.locals.db;

	busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		if(mimetype!=='text/csv'){
			return next(boom.badRequest('File must be of csv type'));
		}
		saveTo = path.join(os.tmpDir(), filename);
		fileName=filename;
		file.pipe(fs.createWriteStream(saveTo));
	});

	busboy.on('finish', function () {

		async.waterfall([
			cb=>db.createJob({
				fileName,
				status:'PENDING'
			},cb),
			(jobId, cb)=>{
				startImportTask(db,jobId,saveTo);
				return cb(null,jobId);
				
			}
		],(error,jobId)=>{
			if(error){
				return next(error);
			}
			res.json({
				message:'Job Submitted',
				jobId
			});
				
		});
	});

	return req.pipe(busboy);
};

function startImportTask(db,jobId,filePath){
	const importJob=new Import(db,filePath,jobId);
	importJob.start((importError)=>{
		let jobStatus='COMPLETED';
		if(importError){
			console.log('IMPORT FAILED', importError);
			jobStatus='FAILED';
		}
		db.updateJobStatus(jobId,jobStatus,(updateError)=>{
			console.log('JOB STATUS UPDATED ',updateError);
			fs.unlink(filePath,()=>{
				console.log('FILE DELETED ', filePath);
			});
		});
	});

}


module.exports = uploadFile;