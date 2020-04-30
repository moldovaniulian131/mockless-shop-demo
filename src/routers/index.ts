import express from 'express';
import applyServerless from '../helpers/serverless/applyServerless';

import { handler as accountHandler } from './account';
import { handler as accountUsersHandler } from './accountUsers';
import { handler as productsHandler } from './products';

export const serverlessHandler = applyServerless((app: express.Application) => {
	accountHandler(app);
	accountUsersHandler(app);
	productsHandler(app);
	
	return app;
});
