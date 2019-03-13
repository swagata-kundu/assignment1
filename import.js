const fs = require('fs');
const parse = require('csv-parse');
const db = require('./lib/db');

const csvDataPath = './task_file.csv';

if (!fs.existsSync(csvDataPath)) {
	throw new Error(`${csvDataPath} file doesn't exists`);
}

// read file content as stream
const fileContentStream = fs.createReadStream(csvDataPath);
// define parser stream
const parser = parse({
	delimiter: ',',
	columns: true
});

//Maximum limit of insertion
const MAX_INSERT = process.env.MAX_INSERT|| 1000;

//bathcing array
let insertArray = [];


//connetc db
db.connect().then(() => {
	// starting piping to csv parser
	fileContentStream.pipe(parser);
}).catch((error) => {
	console.error(error);
});

//handle stream event
parser.on('data', handleRows);
parser.on('end', handleEnd);
parser.on('error',(error)=>{
	console.error(error);
	throw new Error('Error while importing');
});

function handleRows(data) {
	insertArray.push(data);
	// check for batch size;
	if (insertArray.length === MAX_INSERT) {
		// pause stream until insertion completes
		parser.pause();
		db.backEnd.insert(insertArray, err => {
			if (err) {
				console.error(err);
				throw new Error('Error while importing');
			} else {
				// empty global store
				insertArray = [];
				// resume stream
				parser.resume();
			}
		});
	}

}

// method to handle last case
function handleEnd() {
	if (insertArray.length != 0) {
		db.backEnd.insert(insertArray, err => {
			insertArray = [];
			console.log('Completed.');
		});
	}else{
		console.log('Completed.');
	}
}