const {getFixedId}=require('../../lib/utils');
const boom = require('boom');


const listJobs=(req,res,next)=>{
	const db=res.locals.db;
    
	let jobId;
	try{
		jobId=getFixedId(req.params.jobId);
	}catch(error){
		return next(boom.badRequest(error.message));
	}
	db.jobStatus(jobId, (err,status)=>{
		if(err){
			return next(err);
		}
		return res.json({status});
	});

};

module.exports=listJobs;