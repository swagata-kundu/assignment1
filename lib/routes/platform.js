const boom = require('boom');
const async = require('async');

/**
 * Handler for perfoming platfrom specific fiter
 * @param  {} req express request params
 * @param  {} res
 * @param  {} next
 */
const filterPlatform = (req, res, next) => {

	// validate request
	const query = req.query;
	if (!query || !query.platform) {
		return next(boom.badRequest('platform parameter is required'));
	}
	
	const db=res.locals.db;
	const {platform}=query;

	// perform db queries
	async.series({
		totalUids:	cb=> db.totalUids(platform,cb),
		totalUniqueUids:	cb=> db.totalUniqueUids(platform,cb),
		totalCount    :cb=>db.totalCount(cb)    
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

module.exports = filterPlatform;