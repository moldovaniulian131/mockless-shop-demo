import { dbExecute } from '../helpers/mongoose/client';
import {
	ProductDefinition,
	ProductModel,
} from '../models/Product';
import {
	GenericDaoResponse,
	GenericMetadata,
	GenericFilters,
	GenericOrder,
	GenericPagination,
	GenericPrimaryKey,
} from '../typesX';
import {
	applyGenericFilters,
	applyFilterRules,
} from '../helpers/mongoose/applyGenericFilters';
import { normalizeBeforeUpdate } from '../helpers/mongoose/utils';
import ErrorHandler from '../utils/ErrorHandler';
import {
	selectMetadataRequiredProperties,
	restrictMetadataStaticProperties,
	filterByMetadataParams,
	getMetadataFilters,
	addMetadataNestedRules,
} from '../helpers/mongoose/metadata';
import { PRODUCT_NOT_FOUND } from '../constants';

const DB_SECRETS_PREFIX = 'MONGO_DATABASE';

export const add = async (
	product: any,
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return product.save();
	}).then(async (response: GenericDaoResponse) => {
		if (!response.success || !response.data) {
			return response;
		}

		const document = await getById(response.data._id, metadata);

		if (document.data) {
			document.data = document.data[0];
		}

		return document;
	});
};

export const getAll = async (
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return restrictMetadataStaticProperties(
			selectMetadataRequiredProperties(
				addMetadataNestedRules(
					filterByMetadataParams(
						ProductModel,
						metadata,
					),
					metadata,
				),
				metadata,
			),
			metadata,
		).then((documents: any) => {
			return documents && documents.length ? documents.map((document: any) => document.toJSON()) : [];
		});
	});
};

export const getById = async (
	id: GenericPrimaryKey,
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return await restrictMetadataStaticProperties(
			addMetadataNestedRules(
				selectMetadataRequiredProperties(
					ProductModel.findById(id),
					metadata,
				),
				metadata,
			),
			metadata,
		)
			.then((document: any) => {
				return document ? [ document.toJSON() ] : [];
			})
			.catch((err: any) => {
				if (err.name === 'CastError') {
					throw ErrorHandler.notFound(PRODUCT_NOT_FOUND);
				}

				return err;
			});
	}).then((response: GenericDaoResponse) => {
		if (!response.data.length) {
			throw ErrorHandler.notFound(PRODUCT_NOT_FOUND);
		}

		return response;
	});
};

export const getFiltered = async (
	paginationRules?: GenericPagination,
	filterRules?: GenericFilters,
	orderRules?: GenericOrder,
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return await restrictMetadataStaticProperties(
			addMetadataNestedRules(
				selectMetadataRequiredProperties(
					applyGenericFilters(
						ProductModel,
						paginationRules,
						filterRules,
						orderRules,
						getMetadataFilters(metadata),
					),
					metadata,
				),
				metadata,
			),
			metadata
		).then((documents: any) => {
			return documents && documents.length ? documents.map((document: any) => document.toJSON()) : [];
		});
	});
};

export const getFilteredSize = async (
	filterRules?: GenericFilters,
): Promise<GenericDaoResponse> => {
	return dbExecute(DB_SECRETS_PREFIX, async () => {
		let filters = {};
		if (filterRules && Object.keys(filterRules).length) {
			filters = applyFilterRules(filters, filterRules);
		}

		return await ProductModel.countDocuments(filters);
	});
};

export const remove = async (
	id: GenericPrimaryKey,
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	await getById(id, metadata);

	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return ProductModel.deleteOne(Object.assign({}, {
			_id: id,
		}, (metadata && metadata.staticData) || {}));
	}).then((response: GenericDaoResponse) => {
		response.data = {
			id,
		};

		return response;
	});
};

export const update = async (
	id: GenericPrimaryKey,
	product: ProductDefinition,
	metadata?: GenericMetadata,
): Promise<GenericDaoResponse> => {
	await getById(id, metadata);

	return dbExecute(DB_SECRETS_PREFIX, async () => {
		return restrictMetadataStaticProperties(
			ProductModel.findByIdAndUpdate(
				id,
				normalizeBeforeUpdate(product),
				{
					new: true,
				},
			),
			metadata,
		).then((document: any) => {
			return document ? document.toJSON() : null;
		});
	});
};
