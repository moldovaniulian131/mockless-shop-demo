import {
	CognitoUser,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AccountLoginDefinition } from '../../../models/AccountLogin';
import { GenericDaoResponse } from '../../../typesX';
import { serverGenericResponse, throwGenericError } from '../utils';

export default function(cognitoUser: CognitoUser, data: AccountLoginDefinition): Promise<GenericDaoResponse> {
	const {
		username,
		password,
	} = data;

	const authenticationDetails = new AuthenticationDetails({
		Username: username,
		Password: password,
	});

	return new Promise((resolve) => {
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => {
				resolve(serverGenericResponse({
					accessToken: result.getAccessToken().getJwtToken(),
					idToken: result.getIdToken().getJwtToken(),
					refreshToken: result.getRefreshToken().getToken(),
				}));
			},
			onFailure: (error) => {
				resolve(throwGenericError(error));
			},
		});
	});
}