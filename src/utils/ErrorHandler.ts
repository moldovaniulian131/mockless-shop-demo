import * as Boom from 'boom';
import { GenericDaoResponse } from '../typesX';

export default Boom;

export const genericErrorResponse = (message?: string, meta?: any): GenericDaoResponse => {
	let error;

	if (message || meta) {
		error = {
			message,
			meta,
		};
	}

	return {
		success: false,
		error,
	};
};

export const genericSuccessResponse = (data?: any, lastEvaluatedKey?: any): GenericDaoResponse => {
	return {
		success: true,
		data,
		lastEvaluatedKey,
	};
};
