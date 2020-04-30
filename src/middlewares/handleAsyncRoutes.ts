import express from 'express';
import { GenericRequest } from '../helpers/express/typesX';
import ErrorHandler from '../utils/ErrorHandler';

export default function(fn: any) {
	return async (req: GenericRequest, res: express.Response, next: express.NextFunction) => {
		try {
			if (!req.normalizedData) {
				req.normalizedData = req.body;
			}

			const data = await fn(req, res, next);

			if (!data.success) {
				throw ErrorHandler.badRequest(data.error.message, data.error.meta);
			} else {
				res.status(200);
				res.json(data);
			}
		} catch (err) {
			next(err);
		}
	};
}
