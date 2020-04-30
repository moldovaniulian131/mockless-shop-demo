const program = require('commander');
const yaml = require('js-yaml');
const fs = require('fs');

program
	.option('-s, --stage <n>', 'stage')
	.option('-r, --region <n>', 'region')
	.option('-b, --bucket <n>', 'bucket')
	.parse(process.argv);

const stage = program.stage || 'local';
const region = program.region || 'eu-central-1';
const environment = yaml.safeLoad(fs.readFileSync(`./environments/${stage}/secrets.${stage}.yml`, 'utf8'));

module.exports = {
	service: 'a5eaafd476386a700134092ab',
	package: {
		individually: false,
		excludeDevDependencies: true,
	},
	provider: {
		name: 'aws',
		region: region,
		runtime: 'nodejs12.x',
		stage: stage,
		environment,
		usagePlan: {
			quota: {
				limit: 1000,
				offset: 2,
				period: 'MONTH',
			},
			throttle: {
				rateLimit: 10,
				burstLimit: 20,
			},
		},
	},
	plugins: [
		'serverless-webpack',
		'serverless-secrets-plugin',
		'serverless-offline',
	],
	custom: {
		stage: stage,
		webpack: {
			webpackConfig: './config/webpack/serverless.js',
			includeModules: true,
			packager: 'npm',
		},
		host: '0.0.0.0',
		secretsFilePathPrefix: `environments/${stage}/`,
		environment,
		allowedOrigins: environment && environment.API_CORS_WHITE_LIST || '*',
		allowedHeaders: [
			'Content-Type',
			'X-Amz-Date',
			'Authorization',
			'X-Api-Key',
			'X-Amz-Security-Token',
			'X-Amz-User-Agent',
			'Access-Control-Allow-Headers',
			'Access-Control-Allow-Origin',
			'IdToken',
			'RefreshToken',
		],
	},
};
