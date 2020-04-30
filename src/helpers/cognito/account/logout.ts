import { CognitoUser } from 'amazon-cognito-identity-js';
import { GenericDaoResponse } from '../../../typesX';
import {serverGenericResponse, throwGenericError} from '../utils';

export default function(user: CognitoUser): Promise<GenericDaoResponse> {
	return new Promise((resolve) => {
		user.globalSignOut({
			onSuccess: () => {
				resolve(serverGenericResponse());
			},
			onFailure: (error: any) => {
				resolve(throwGenericError(error));
			},
		});
	});
}