const base = require('./config/serverless/base');

const functions = {
	'5eaafd476386a700134092ab': {
		handler: 'src/routers/index.serverlessHandler',
		warmup: true,
		timeout: 30,
		events: [
			{
				http: {
					path: '/{any+}',
					method: 'ANY',
					cors: {
						origin: '${self:custom.allowedOrigins}',
						headers: '${self:custom.allowedHeaders}',
					},
				},
			},
		],
	},
};

module.exports = Object.assign({}, base, { functions });
