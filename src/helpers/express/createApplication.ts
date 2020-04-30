import * as express from 'express';
import * as bodyParser from 'body-parser';
import handleErrors from '../../middlewares/handleErrors';
import i18n from '../i18n';
import cors = require('cors');

export default function(routers: any): express.Application {
	let app = express();
	
	app.use(cors());

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(i18n.init);
	

	app = routers(app);

	app.use(handleErrors);

	return app;
}