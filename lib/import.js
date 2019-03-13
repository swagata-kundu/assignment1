const fs = require('fs');
const parse = require('csv-parse');

class Import{
	constructor(table,csvDatapath,jobId){
		this.backEnd=table;
		this.csvDataPath=csvDatapath;
		this.jobId=jobId||null;
	}
	start(done){
		if (!fs.existsSync(this.csvDataPath)) {
			return done(new Error(`${this.csvDataPath} file doesn't exists`));
		}
		const fileContentStream = fs.createReadStream(this.csvDataPath);

		const parser = parse({
			delimiter: ',',
			columns: true
		});
        
		//Maximum limit of insertion
		const MAX_INSERT = process.env.MAX_INSERT?parseInt(process.env.MAX_INSERT): 1000;
        
		//bathcing array
		let insertArray = [];

		// starting piping to csv parser
		fileContentStream.pipe(parser);

		//handle each row of csv file
		const handleRows=(row)=> {
			const data=Object.assign(row,{jobId:this.jobId});
			insertArray.push(data);
			// check for batch size;
			if (insertArray.length === MAX_INSERT) {
				// pause stream until insertion completes
				parser.pause();
				this.backEnd.insertUserData(insertArray, err => {
					if (err) {
						parser.end();
						return done(err);
					} else {
						// empty global store
						insertArray = [];
						// resume stream
						parser.resume();
					}
				});
			}
		};
        
		// method to handle last case
		const handleEnd=()=> {
			if (insertArray.length != 0) {
				this.backEnd.insertUserData(insertArray, err => {
					insertArray = [];
					return done(err);
				});
			}else{
				return done();
			}
		};
        
		//handle stream event
		parser.on('data', handleRows);
		parser.on('end', handleEnd);
		parser.on('error',(error)=>{
			return done(error);
		});
	}
}

module.exports=Import;