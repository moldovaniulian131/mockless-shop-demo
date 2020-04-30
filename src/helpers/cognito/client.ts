import {
	CognitoAccessToken,
	CognitoIdToken,
	CognitoRefreshToken,
	CognitoUser,
	CognitoUserPool,
	CognitoUserSession,
} from 'amazon-cognito-identity-js';
import fetch from 'node-fetch';
import ErrorHandler from '../../utils/ErrorHandler';
import * as request from 'request-promise';
import { COGNITO_BAD_CONFIG } from '../../constants';

(global as any).fetch = fetch;

export const getUserPool = (userPoolIdentifierPrefix: string): CognitoUserPool => {
	try {
		return new CognitoUserPool({
			UserPoolId: process.env[`${userPoolIdentifierPrefix}_USER_POOL_ID`],
			ClientId: process.env[`${userPoolIdentifierPrefix}_CLIENT_ID`],
		} as any);
	} catch (error) {
		throw ErrorHandler.badImplementation(COGNITO_BAD_CONFIG, error);
	}
};

export const getCognitoUser = (userPool: CognitoUserPool, username: string) => {
	return new CognitoUser({
		Username: username,
		Pool: userPool,
	});
};

export const getJwks = async (userPoolIdentifierPrefix: string, _token: string) => {
	const userPollId = process.env[`${userPoolIdentifierPrefix}_USER_POOL_ID`];

	if (!userPollId) {
		return null;
	}

	const poolRegion = userPollId.split('_')[0];

	if (!poolRegion) {
		return null;
	}

	return request(`https://cognito-idp.${poolRegion}.amazonaws.com/${userPollId}/.well-known/jwks.json`, {
		json: true,
	})
		.then((response: any) => {
			const { keys } = response;

			if (!keys || !keys.length) {
				return {};
			}

			return keys.reduce((reduced: any, jwk: any) => {
				reduced[jwk.kid] = jwk;

				return reduced;
			}, {});
		});
};

export const updateCognitoUserSession = (user: CognitoUser, {
	idToken,
	refreshToken,
	accessToken,
}: any = {}) => {
	user.setSignInUserSession(new CognitoUserSession({
		IdToken: new CognitoIdToken({
			IdToken: String(idToken || ''),
		}),
		RefreshToken: new CognitoRefreshToken({
			RefreshToken: String(refreshToken || ''),
		}),
		AccessToken: new CognitoAccessToken({
			AccessToken: String(accessToken || ''),
		}),
	}));
};

