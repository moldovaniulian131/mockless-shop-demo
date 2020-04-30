import {
	CognitoUser,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { GenericDaoResponse } from '../../../typesX';
import { AccountPasswordChangeDefinition } from '../../../models/AccountPasswordChange';
import { AccountPasswordRecoverDefinition } from '../../../models/AccountPasswordRecover';
import {serverGenericResponse, throwGenericError} from '../utils';

export const changePassword = (
	cognitoUser: CognitoUser,
	data: AccountPasswordChangeDefinition,
): Promise<GenericDaoResponse> => {
	const {
		username,
		password,
		newPassword,
	} = data;

	const authenticationDetails = new AuthenticationDetails({
		Username: username,
		Password: password,
	});

	return new Promise(async (resolve) => {
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: () => {
				cognitoUser.changePassword(password, newPassword, (error: any) => {
					if (error) {
						resolve(throwGenericError(error));
					} else {
						resolve(serverGenericResponse({
							username,
						}));
					}
				});
			},
			onFailure: (error: any) => {
				resolve(throwGenericError(error));
			},
		});
	});
};

export const recoverPassword = (cognitoUser: CognitoUser): Promise<GenericDaoResponse> => {
	return new Promise(async (resolve) => {
		cognitoUser.forgotPassword({
			onSuccess: (response) => {
				resolve(serverGenericResponse(response));
			},
			onFailure: (error) => {
				resolve(throwGenericError(error));
			},
		});
	});
};

export const recoverPasswordConfirm = (
	cognitoUser: CognitoUser,
	data: AccountPasswordRecoverDefinition,
): Promise<GenericDaoResponse> => {
	const {
		username,
		verificationCode,
		newPassword,
	} = data;

	return new Promise(async (resolve) => {
		cognitoUser.confirmPassword(verificationCode as any, newPassword as any, {
			onSuccess() {
				resolve(serverGenericResponse({
					username,
				}));
			},
			onFailure(error: any) {
				resolve(throwGenericError(error));
			},
		});
	});
};