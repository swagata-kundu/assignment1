## Assignment

**steps to configure**

 - `git clone https://github.com/swagata-kundu/assignment1.git`
 - `cd assignment1`
 - `nvm use`
 - `npm i`
 - `npm start` 

The application will be up and running at port 3000. There are three configuration. by default config/default.json will load & it will start app using mysql. Cahnge db setting accordingly. To start the app using mongodb set NODE_ENV=mongo and then npm start;

    `export NODE_ENV=mongo; npm start;`

**import script**
To import the data inside task.csv run the following command

 - `node import.js` this will import in mysql db.
 - `export NODE_ENV=mongo;node import.js;` this will insert data in mongodb collection.
 - No of maximum record can be set by setting env veriable `export MAX_INSERT=100` . Default it is 1000.

**live demo**
The application is hosted at [http://saavn.assignment.swagatak.one](http://saavn.assignment.swagatak.one)
Api documentaion is available at [saavn.assignment.swagatak.one/api-docs](saavn.assignment.swagatak.one/api-docs)