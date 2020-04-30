import express from 'express';
import handleAsyncRoutes from '../middlewares/handleAsyncRoutes';
import handleAuth from '../middlewares/handleAccountAuth';
import handleResourcePermissions from '../middlewares/cognitoResourcePermissions';
import handleMetadata from '../middlewares/handleMetadata';
import applyServerless from '../helpers/serverless/applyServerless';
import ErrorHandler from '../utils/ErrorHandler';
import AccountController from '../controllers/AccountController';
import {
	UnauthorizedRequest,
	AuthorizedRequest,
} from '../helpers/cognitoExpress/typesX';
import {
	COGNITO_JWT_RENEW_TOKEN_NOT_PROVIDED,
	COGNITO_REGISTER_DATA_NOT_PROVIDED,
	COGNITO_LOGIN_DATA_NOT_PROVIDED,
	COGNITO_PASSWORD_DATA_NOT_PROVIDED,
	COGNITO_RECOVER_ACCOUNT_DATA_NOT_PROVIDED,
	COGNITO_REGISTER_USERNAME_NOT_PROVIDED,
	COGNITO_REGISTER_VERIFICATION_CODE_NOT_PROVIDED,
} from '../constants';

export const handler = (app: express.Application): express.Application => {
	const account = new AccountController();

	app.post(
		'/account/register',
		handleAuth({ optional: true }),
		handleResourcePermissions({ requiredGroups: ['superAdmin'], optional: true }),
		handleMetadata({
			metadata: {
				'superAdmin': {
					staticData: null,
				},
				defaultConfig: {
					staticData: {
						groups: ['regularUser'],
						roles: [],
					},
				},
			},
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				normalizedData,
				metadata,
			} = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(COGNITO_REGISTER_DATA_NOT_PROVIDED);
			}

			return await account.register(normalizedData, metadata);
		}),
	);

	app.post(
		'/account/register/confirm',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData: {
					username,
					verificationCode,
				},
			} = req;

			if (!verificationCode) {
				throw ErrorHandler.badRequest(COGNITO_REGISTER_VERIFICATION_CODE_NOT_PROVIDED);
			}

			if (!username) {
				throw ErrorHandler.badRequest(COGNITO_REGISTER_USERNAME_NOT_PROVIDED);
			}

			return await account.confirmRegister(username, verificationCode);
		}),
	);

	app.post(
		'/account/register/resend-code',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData: {
					username,
				},
			} = req;

			if (!username) {
				throw ErrorHandler.badRequest(COGNITO_REGISTER_USERNAME_NOT_PROVIDED);
			}

			return await account.resendRegisterCode(username);
		}),
	);

	app.post(
		'/account/login',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const { normalizedData } = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(COGNITO_LOGIN_DATA_NOT_PROVIDED);
			}

			return await account.login(normalizedData);
		}),
	);

	app.post(
		'/account/logout',
		handleAuth(),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const { authUser } = req;

			return await account.logout(authUser);
		}),
	);

	app.post(
		'/account/password/recover',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const { normalizedData } = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(COGNITO_RECOVER_ACCOUNT_DATA_NOT_PROVIDED);
			}

			return await account.recoverPassword(normalizedData);
		}),
	);

	app.post(
		'/account/password/recover/confirm',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const { normalizedData } = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(COGNITO_PASSWORD_DATA_NOT_PROVIDED);
			}

			return await account.recoverPasswordConfirm(normalizedData);
		}),
	);

	app.post(
		'/account/password/change',
		handleAuth(),
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const { normalizedData } = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(COGNITO_PASSWORD_DATA_NOT_PROVIDED);
			}

			return await account.changePassword(normalizedData);
		}),
	);

	app.post(
		'/account/token/renew',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData: {
					refreshToken,
				},
			} = req;

			if (!refreshToken) {
				throw ErrorHandler.badRequest(COGNITO_JWT_RENEW_TOKEN_NOT_PROVIDED);
			}

			return await account.renewToken(refreshToken);
		}),
	);

	return app;
};

export const serverlessHandler = applyServerless(handler);
