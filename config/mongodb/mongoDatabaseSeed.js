const yaml = require('js-yaml');
const fs = require('fs');

const {
	env: {
		STAGE,
	},
} = process;

const secrets = yaml.safeLoad(fs.readFileSync(`environments/${STAGE}/secrets.${STAGE}.yml`, 'utf8'));
let migrationsDir = `environments/${STAGE}/db/mongoDatabase/migrations`;

if (!fs.existsSync(migrationsDir)) {
	migrationsDir = 'db/mongoDatabase/migrations';
}

module.exports = {
	mongodb: {
		url: secrets['MONGO_DATABASE_PROTOCOL'] + '://' + secrets['MONGO_DATABASE_ROOT_AUTH'] + '@' + secrets['MONGO_DATABASE_HOST'] + ':' + secrets['MONGO_DATABASE_PORT'],
		databaseName: secrets['MONGO_DATABASE_NAME'],
		options: {
			useNewUrlParser: true,
		},
	},
	migrationsDir,
	changelogCollectionName: 'migrations',
};
		