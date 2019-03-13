const boom = require('boom');
const async = require('async');

const {getFixedId}=require('../../lib/utils');

/**
 * Handler for perfoming platfrom specific fiter
 * @param  {} req express request params
 * @param  {} res
 * @param  {} next
 */
const jobAnalytics = (req, res, next) => {

	// validate request
	const query = req.query;
	if (!query || !query.platform) {
		return next(boom.badRequest('platform parameter is required'));
	}
	
	const db=res.locals.db;
	const {platform}=query;
	let jobId;
	try{
		jobId=getFixedId(req.params.jobId);
	}catch(error){
		return next(boom.badRequest(error.message));
	}

	// perform db queries
	async.series({
		jobStatus:cb=>{
			db.jobStatus(jobId,(error,status)=>{
				if(error){
					return cb(error);
				}
				if(status!=='COMPLETED'){
					return cb(boom.notFound(`JOB STATUS IS: ${status}`));
				}
				return cb();
			});
		},
		totalUids:	cb=> db.totalUids({platform,jobId},cb),
		totalUniqueUids:	cb=> db.totalUniqueUids({platform,jobId},cb),
		totalCount    :cb=>db.totalCount(jobId,cb)    
	},(err,result)=>{
		if(err){
			return next(err);
		}
        
		const{totalUids,totalUniqueUids,totalCount}=result;

		// calculating platform share
		const platformShare=totalCount? (totalUids/totalCount)*100:0;

		return res.json({
			totalUids,
			totalUniqueUids,
			platformShare:platformShare.toFixed(2)
		});
	});
};

module.exports = jobAnalytics;