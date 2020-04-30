import * as express from 'express';
import { GenericRequest } from '../helpers/express/typesX';

const getErrorName = (error: any) => error.match(/^[A-Z0-9_]*$/) && error || undefined;

export default function(
	error: any,
	req: GenericRequest,
	res: express.Response,
	next: express.NextFunction,
) {
	if (res.headersSent) {
		return next(error);
	}

	if (error.isBoom) {
		const {
			data,
			output: {
				statusCode,
				payload: {
					message,
				},
			},
		} = error;

		const errorName = getErrorName(message);

		res.status(statusCode);
		res.json({
			success: false,
			error: {
				statusCode,
				name: errorName,
				message: !errorName ? message : req.__(errorName),
				meta: data,
			},
		});
	} else if (error.constructor === Error) {
		const errorName = getErrorName(error);
		const statusCode = 500;

		res.status(statusCode);
		res.json({
			success: false,
			error: {
				statusCode,
				name: errorName,
				message: !errorName ? error : 'translate = ' + errorName,
			},
		});
	} else {
		let { statusCode } = error;

		statusCode = statusCode || 500;

		res.status(statusCode);
		res.json({
			success: false,
			error,
		});
	}
}
