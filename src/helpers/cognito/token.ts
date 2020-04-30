import { getJwks } from './client';
import {convertJwksToPem, serverGenericResponse, throwGenericError} from './utils';
import * as jwt from 'jsonwebtoken';
import {
	CognitoUser,
	CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { GenericDaoResponse } from '../../typesX';
import { COGNITO_INVALID_TOKEN } from '../../constants';

export const validateToken = async (userPoolIdentifierPrefix: string, token: string): Promise<GenericDaoResponse> => {
	const jwts = await getJwks(userPoolIdentifierPrefix, token);
	const pems = convertJwksToPem(jwts);

	const decodedJwt: any = jwt.decode(token, {
		complete: true,
	});

	if (!decodedJwt) {
		return throwGenericError({
			message: COGNITO_INVALID_TOKEN,
		});
	}

	const kid = decodedJwt.header.kid;
	const pem = pems[kid];

	if (!pem) {
		return throwGenericError({
			message: COGNITO_INVALID_TOKEN,
		});
	}

	return new Promise((resolve) => {
		jwt.verify(token, pem, (error: any, result: any) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				resolve(serverGenericResponse(result));
			}
		});
	});
};

export const renewToken = (cognitoUser: CognitoUser, refreshToken: string): Promise<GenericDaoResponse> => {
	const cognitoRefreshToken = new CognitoRefreshToken({
		RefreshToken: refreshToken,
	});

	return new Promise((resolve) => {
		cognitoUser.refreshSession(cognitoRefreshToken, (error, session) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				resolve(serverGenericResponse({
					accessToken: session.accessToken.jwtToken,
					idToken: session.idToken.jwtToken,
					refreshToken: session.refreshToken.token,
				}));
			}
		});
	});
};



