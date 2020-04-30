import * as jwkToPem from 'jwk-to-pem';
import * as changeCase from 'change-case';
import {
	genericErrorResponse,
	genericSuccessResponse,
} from '../../utils/ErrorHandler';

export const convertJwksToPem = (jwks: any) => {
	if (!jwks) {
		return {};
	}

	return Object.keys(jwks).reduce((reduced: any, jwkId: string) => {
		reduced[jwkId] = jwkToPem(jwks[jwkId]);

		return reduced;
	}, {});
};

export const throwGenericError = (error: any, meta?: any) => {
	return genericErrorResponse(
		error.code ? `COGNITO_${changeCase.constantCase(error.code)}` : error.message,
		meta,
	);
};

export const serverGenericResponse = (response?: any) => {
	return genericSuccessResponse(response);
};
