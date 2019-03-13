const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const morgan=require('morgan');
const helmet=require('helmet');
const cors=require('cors');
const swaggerUi = require('swagger-ui-express');


const routes = require('./lib/routes');
const ErrorHandler=require('./lib/errorhandler');
const db=require('./lib/db');

let swaggerConfig=require('./swagger.json');
swaggerConfig=Object.assign(swaggerConfig,{host:config.get('host_url')});

const app = express();
const errorHandler=new ErrorHandler();

app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler.build());
app.use(morgan('dev'));
app.use(helmet());
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerConfig));
app.use('/api', routes);
app.use(errorHandler.unhandledRequest());

db.connect().then(() => {
	console.info('database connected. starting app');
	app.listen(config.get('port'));
}).catch((err) => {
	console.error('unable to connect to database. Application can not start ', err);
});

