const util=require('util');


class ErrorHandler {

	/**
     * @param  {} val
     */
	stringify(val) {
		const {
			stack,
		} = val;
		if (stack) {
			return String(stack);
		}

		const str = String(val);
		return str === toString.call(val) ?
			util.inspect(val) :
			str;
	}

	/**
     * @param  {} err
     */
	logError(err) {
		const errorString = this.stringify(err);
		console.error(errorString);
			
	}
	

	/**
     */
	build() {
		return (err, req, res, next) => {
			if (err && !res.headersSent) {
				this.logError(err);

				// Handle Boom Errors
				if (err.isBoom) {
					return res.status(err.output.statusCode).json(err.output.payload);
				}

				// Handle statusCode sent by methods
				if (err.statusCode) {
					return res.status(err.statusCode).json({
						message: err.message,
						error: err.name,
						statusCode: err.statusCode,
					});
				}

				// Handle Mongoose casting Errors
				if (err.name === 'CastError') {
					return res.status(400).json({
						message: 'A cast error occured.',
						error: 'Bad Request',
						statusCode: 400,
					});
				}

				if (err.name === 'AuthenticationError') {
					return res.status(401).json({
						message: err.message,
						error: err.name,
						statusCode: 401,
					});
				}


				// Handle Mongoose casting Errors
				if (err.name === 'MongoError') {
					return res.status(500).json({
						message: 'Problem with database operation',
						error: err.name,
						statusCode: 500,
					});
				}

				// Handle Joi validation Errors
				if (err.name === 'ValidationError') {
					return res.status(400).json({
						message: err.isJoi ?
							err.message : 'A validation error occured.',
						error: 'Bad Request',
						statusCode: 400,
					});
				}

				// Handle other Internal Error
				return res.status(500).json({
					message: err.message,
					error: err.stack || 'Internal Server Error',
					statusCode: 500,
				});
			}

			return next();
		};
	}

	unhandledRequest() {
		return (req, res, next) => {
			if (!res.headersSent) {
				// Handle unhandled requests
				return res.status(501).json({
					message: 'Request is not handled',
					error: 'Not Implemented',
					statusCode: 501,
				});
			}
			return next();
		};
	}
}

module.exports=ErrorHandler;