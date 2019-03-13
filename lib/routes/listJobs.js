const listJobs=(req,res,next)=>{
	const db=res.locals.db;
    
	db.listJobs((err,jobs)=>{
		if(err){
			return next(err);
		}
		return res.json(jobs);
	});

};

module.exports=listJobs;