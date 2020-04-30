import * as mongoose from 'mongoose';
import {
	GenericDaoResponse,
} from '../../typesX';
import ErrorHandler, { genericSuccessResponse } from '../../utils/ErrorHandler';
import { UNEXPECTED_INTERNAL_ERROR } from '../../constants';

let dbConnection: any;

const successResponse = (data: any) => {
	return genericSuccessResponse(data);
};

const errorResponse = (error: any) => {
	if (error.isBoom) {
		throw error;
	}

	throw ErrorHandler.badImplementation(UNEXPECTED_INTERNAL_ERROR, error);
};

const generateConnectionString = (dbIdentifierPrefix: string) => {
	const protocol = process.env[`${dbIdentifierPrefix}_PROTOCOL`];
	const auth = process.env[`${dbIdentifierPrefix}_AUTH`];
	const host = process.env[`${dbIdentifierPrefix}_HOST`];
	const port = process.env[`${dbIdentifierPrefix}_PORT`];
	const name = process.env[`${dbIdentifierPrefix}_NAME`];

	return `${protocol}://${auth}@${host}${port ? `:${port}` : ''}/${name}`;
};

export const dbExecute = async (dbIdentifierPrefix: string, callback: any): Promise<GenericDaoResponse> => {
	try {
		if (!dbConnection || !dbConnection.connection.readyState) {
			dbConnection = await mongoose.connect(
				generateConnectionString(dbIdentifierPrefix),
				{
					useNewUrlParser: true,
					keepAlive: true,
					poolSize: 20,
					connectTimeoutMS: 30000,
					reconnectTries: 5,
					reconnectInterval: 500,
				},
			);
		}

		const result = await callback(dbConnection);

		return successResponse(result);
	} catch (error) {
		console.error(error);
		return errorResponse(error);
	}
};
