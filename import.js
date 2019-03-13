

const db = require('./lib/db');
const Import = require('./lib/import');

const csvDataPath = './task_file.csv';


//connetc db
db.connect().then(() => {
	// starting piping to csv parser
	const importData = new Import(db.backEnd, csvDataPath);
	importData.start((importError)=>{
		console.log(importError?importError:'Import completed');
		process.exit(importError?1:0);
	});
}).catch((error) => {
	console.error(error);
	process.exit(1);
});