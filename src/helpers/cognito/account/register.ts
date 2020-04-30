import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { normalizeAttributesList } from './attributes';
import { AccountUserDefinition } from '../../../models/AccountUser';
import { GenericDaoResponse } from '../../../typesX';
import {
	serverGenericResponse,
	throwGenericError,
} from '../utils';

export default function(userPool: CognitoUserPool, user: AccountUserDefinition): Promise<GenericDaoResponse> {
	const {
		username = '',
		password = '',
		email = '',
	} = user;

	return new Promise((resolve) => {
		userPool.signUp(
			username,
			password,
			normalizeAttributesList({
				email,
			}),
			[],
			(error: any, result: any) => {
				if (error) {
					resolve(throwGenericError(error));
				} else {
					resolve(serverGenericResponse(result));
				}
			});
	});
}

export const CognitoConfirmRegister = async (
	cognitoUser: CognitoUser,
	verificationCode: string,
): Promise<GenericDaoResponse> => {
	return new Promise((resolve) => {
		cognitoUser.confirmRegistration(verificationCode, true, (error, result) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				resolve(serverGenericResponse(result));
			}
		});
	});
};

export const CognitoResendRegisterCode = async (cognitoUser: CognitoUser): Promise<GenericDaoResponse> => {
	return new Promise((resolve) => {
		cognitoUser.resendConfirmationCode((error, result) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				resolve(serverGenericResponse(result));
			}
		});
	});
};