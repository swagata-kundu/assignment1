const config=require('config');

const getFixedId=id=>{
	if(config.get('db_config').db_type==='mysql'){
		if(!isFinite(id)){
			throw new Error('Invalide Id');
		}
		return parseInt(id,10);
	}
};

module.exports={
	getFixedId
};