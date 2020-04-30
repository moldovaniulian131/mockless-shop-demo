import {
	CognitoUser,
	CognitoUserAttribute,
	ICognitoUserAttributeData,
} from 'amazon-cognito-identity-js';
import { CognitoAttributes } from '../typesX';
import { GenericDaoResponse } from '../../../typesX';
import { throwGenericError, serverGenericResponse } from '../utils';

const arrayTypeAttributes = [
	'groups',
	'roles',
];

const customAttributes = [
	'groups',
	'roles',
];

export const normalizeAttributesList = (attributes?: CognitoAttributes): CognitoUserAttribute[] => {
	if (!attributes) {
		return [];
	}

	return Object.keys(attributes).map((attributeName: string) => {
		return new CognitoUserAttribute({
			Name: customAttributes.indexOf(attributeName) !== -1
				? `custom:${attributeName}`
				: attributeName,
			Value: arrayTypeAttributes.indexOf(attributeName) !== -1
				? (attributes[attributeName] as any).join(',')
				: attributes[attributeName],
		});
	}).filter((attribute: CognitoUserAttribute) => !!attribute.getValue());
};

export const getAttributes = async (user: CognitoUser): Promise<GenericDaoResponse> => {
	return await new Promise((resolve) => {
		user.getUserAttributes((error: any, result: any) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				const attributes = result.reduce((reduced: any, attribute: any) => {
					const name = attribute.getName().replace('custom:', '');
					const value = attribute.getValue() || '';

					reduced[name] = arrayTypeAttributes.indexOf(name) !== -1
						? value.split(',')
						: value;

					return reduced;
				}, {});

				resolve(serverGenericResponse(attributes));
			}
		});
	});
};

export const updateAttributes = (
	cognitoUser: CognitoUser,
	attributes: ICognitoUserAttributeData[],
): Promise<GenericDaoResponse> => {
	return new Promise((resolve) => {
		cognitoUser.updateAttributes(attributes, (error: any, result: any) => {
			if (error) {
				resolve(throwGenericError(error));
			} else {
				resolve(serverGenericResponse(result));
			}
		});
	});
};