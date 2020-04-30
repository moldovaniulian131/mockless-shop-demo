import * as express from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { validateToken as validateTokenService } from '../helpers/cognito/token';
import { getUserPool, getCognitoUser, updateCognitoUserSession } from '../helpers/cognito/client';
import { HandleAuthConfig } from '../helpers/cognitoExpress/typesX';
import * as AccountUsersDao from '../dao/AccountUsersDao';

import {
	COGNIT_JWT_TOKEN_NOT_FOUND,
	COGNITO_JWT_IDENTITY_TOKEN_NOT_FOUND,
} from '../constants';

export default ({
	optional,
}: HandleAuthConfig = {}) => async (
	req: any,
	_res: express.Response,
	next: express.NextFunction,
) => {
	try {
		const {
			headers: {
				authorization,
				idtoken,
				refreshtoken,
			},
		} = req;

		const userPoolIdentifier = 'ACCOUNT';

		if (optional && (!authorization || !idtoken)) {
			return next();
		}

		if (!authorization) {
			throw ErrorHandler.unauthorized(COGNIT_JWT_TOKEN_NOT_FOUND);
		}

		if (!idtoken) {
			throw ErrorHandler.unauthorized(COGNITO_JWT_IDENTITY_TOKEN_NOT_FOUND);
		}

		const token: any = await validateTokenService(userPoolIdentifier, authorization);

		if (!token.success) {
			if (!optional) {
				throw ErrorHandler.unauthorized(token.error.message);
			} else {
				return next();
			}
		} else {
			const {
				data: {
					sub,
					username,
				},
			} = token;

			const userPool = getUserPool(userPoolIdentifier);
			const user = getCognitoUser(userPool, username);
			updateCognitoUserSession(user, {
				accessToken: authorization,
				idToken: idtoken,
				refreshToken: refreshtoken,
			});

			const userResponse = await AccountUsersDao.getFiltered(undefined, [{
				property: 'cognitoId',
				value: sub,
			}]);

			if (!userResponse.success || !userResponse.data.length) {
				throw ErrorHandler.unauthorized();
			} else {
				const attributes = userResponse.data[0];
				
				req.authUser = user;
				req.authUserAttributes = attributes;
				req.authUserGroups = attributes.groups;
				req.authUserRoles = attributes.roles;
			}
		}

		return next();
	} catch (error) {
		if (optional) {
			return next();
		} else {
			return next(error);
		}
	}
};