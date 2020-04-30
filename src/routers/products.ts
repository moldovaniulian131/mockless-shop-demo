import express from 'express';
import ProductsController from '../controllers/ProductsController';
import handleAsyncRoutes from '../middlewares/handleAsyncRoutes';
import applyServerless from '../helpers/serverless/applyServerless';
import ErrorHandler from '../utils/ErrorHandler';
import { UnauthorizedRequest } from '../helpers/express/typesX';
import {
	PRODUCT_DATA_NOT_PROVIDED,
	PRODUCT_ID_NOT_PROVIDED,
} from '../constants';

export const handler = (app: express.Application): express.Application => {
	const products = new ProductsController();

	app.get(
		'/products',
		handleAsyncRoutes(async (_req: UnauthorizedRequest) => {
			
			
			return await products.getAll();
		}),
	);

	app.post(
		'/products',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData,
			} = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}
			
			if (Array.isArray(normalizedData)) {
				return await products.bulkAdd(normalizedData);
			} else {
				return await products.add(normalizedData);
			}
		}),
	);

	app.post(
		'/products/filter',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData: {
					pagination,
					filters,
					sorting,
				},
			} = req;

			return await products.getFilteredData(
				pagination,
				filters,
				sorting,
			);
		}),
	);

	app.get(
		'/products/:productId',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				params: {
					productId,
				},
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			return await products.getById(productId);
		}),
	);

	app.delete(
		'/products/:productId',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				params: {
					productId,
				},
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			return await products.remove(productId, metadata);
		}),
	);

	app.put(
		'/products/:productId',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				params: {
					productId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}

			return await products.update(productId, normalizedData, metadata);
		}),
	);

	app.patch(
		'/products/:productId',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				params: {
					productId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}

			return await products.patch(productId, normalizedData, metadata);
		}),
	);

	return app;
};


export const serverlessHandler = applyServerless(handler);
