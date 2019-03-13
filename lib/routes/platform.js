const boom = require('boom');
const async = require('async');

const filterPlatform = (req, res, next) => {

	const query = req.query;
	if (!query || !query.platform) {
		return next(boom.badRequest('platform parameter is required'));
	}

	const db=res.locals.db;
	const {platform}=query;

	async.series({
		totalUids:	cb=> db.totalUids(platform,cb),
		totalUniqueUids:	cb=> db.totalUniqueUids(platform,cb),
		totalCount    :cb=>db.totalCount(cb)    
	},(err,result)=>{
		if(err){
			return next(err);
		}
        
		const{totalUids,totalUniqueUids,totalCount}=result;

		const platformShare=totalCount? (totalUids/totalCount)*100:0;
		return res.json({
			totalUids,
			totalUniqueUids,
			platformShare:platformShare.toFixed(2)
		});
	});


};

module.exports = filterPlatform;