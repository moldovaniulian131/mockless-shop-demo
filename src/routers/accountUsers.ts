import express from 'express';
import AccountUsersController from '../controllers/AccountUsersController';
import handleAsyncRoutes from '../middlewares/handleAsyncRoutes';
import applyServerless from '../helpers/serverless/applyServerless';
import ErrorHandler from '../utils/ErrorHandler';
import {
	AuthorizedRequest,
} from '../helpers/cognitoExpress/typesX';
import handleAccountAuth from '../middlewares/handleAccountAuth';
import handleResourcePermissions from '../middlewares/cognitoResourcePermissions';
import {
	ACCOUNT_USER_DATA_NOT_PROVIDED,
	ACCOUNT_USER_ID_NOT_PROVIDED,
} from '../constants';

export const handler = (app: express.Application): express.Application => {
	const accountUsers = new AccountUsersController();

	app.get(
		'/account/user',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (_req: AuthorizedRequest) => {
			
			
			return await accountUsers.getAll();
		}),
	);

	app.post(
		'/account/user',
		handleAccountAuth({ optional: true }),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
			optional: true,
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				normalizedData,
			} = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_DATA_NOT_PROVIDED);
			}
			
			if (Array.isArray(normalizedData)) {
				return await accountUsers.bulkAdd(normalizedData);
			} else {
				return await accountUsers.add(normalizedData);
			}
		}),
	);

	app.post(
		'/account/user/filter',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				normalizedData: {
					pagination,
					filters,
					sorting,
				},
			} = req;

			return await accountUsers.getFilteredData(
				pagination,
				filters,
				sorting,
			);
		}),
	);

	app.get(
		'/account/user/:accountUserId',
		handleAccountAuth(),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					accountUserId,
				},
			} = req;

			if (!accountUserId) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_ID_NOT_PROVIDED);
			}

			return await accountUsers.getById(accountUserId);
		}),
	);

	app.delete(
		'/account/user/:accountUserId',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					accountUserId,
				},
				metadata,
			} = req;

			if (!accountUserId) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_ID_NOT_PROVIDED);
			}

			return await accountUsers.remove(accountUserId, metadata);
		}),
	);

	app.put(
		'/account/user/:accountUserId',
		handleAccountAuth(),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					accountUserId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!accountUserId) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_DATA_NOT_PROVIDED);
			}

			return await accountUsers.update(accountUserId, normalizedData, metadata);
		}),
	);

	app.patch(
		'/account/user/:accountUserId',
		handleAccountAuth(),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					accountUserId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!accountUserId) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(ACCOUNT_USER_DATA_NOT_PROVIDED);
			}

			return await accountUsers.patch(accountUserId, normalizedData, metadata);
		}),
	);

	return app;
};


export const serverlessHandler = applyServerless(handler);
