import * as ProductsDao from '../dao/ProductsDao';
import {
	ProductDefinition,
	ProductModel,
} from '../models/Product';
import ErrorHandler from '../utils/ErrorHandler';
import {
	GenericFilters,
	GenericOrder,
	GenericPagination,
	GenericPrimaryKey,
	GenericDaoResponse,
	GenericMetadata,
} from '../typesX';
import { UNPROCESSABLE_ENTITY } from '../constants';

export default class ProductsController {
	async add(
		productData: ProductDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const product = new ProductModel(Object.assign(
			{},
			productData,
			metadata && metadata.staticData || {},
		));
		const errors = await product.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await ProductsDao.add(product, metadata);
	}
	
	async bulkAdd(
		productData: ProductDefinition[],
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const errorsList: any = [];
		const productModels: any = [];
		const responses: any = [];
		
		for (let i = 0; i < productData.length; i++) {
			const data = productData[i];

			const model = new ProductModel(Object.assign(
				{},
				data,
				metadata && metadata.staticData || {},
			));

			const errors = await model.runValidations();

			if (errors) {
				errorsList.push(errors);
			} else {
				productModels.push(model);
			}
		}

		if (errorsList.length) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errorsList);
		}

		for (let i = 0; i < productModels.length; i++) {
			responses.push(await ProductsDao.add(productModels[i], metadata));
		}

		return {
			success: true,
			data: responses,
		};
	}

	async getAll(
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await ProductsDao.getAll(metadata);
	}

	async getById(
		id: GenericPrimaryKey,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await ProductsDao.getById(id, metadata);
	}

	async getFilteredData(
		paginationRules?: GenericPagination,
		filterRules?: GenericFilters,
		orderRules?: GenericOrder,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const sizeResponse = await ProductsDao.getFilteredSize(filterRules);
		const dataResponse = await ProductsDao.getFiltered(paginationRules, filterRules, orderRules, metadata);

		return Object.assign({}, dataResponse, {
			size: sizeResponse.data,
		});
	}

	async patch(
		id: GenericPrimaryKey,
		data: ProductDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const oldProductResponse: GenericDaoResponse = await this.getById(id);
		const oldProductData = oldProductResponse.data && oldProductResponse.data[0];
		const newProduct = new ProductModel(Object.assign(
			{},
			oldProductData,
			data,
			metadata && metadata.staticData || {},
		));
	
		const errors = await newProduct.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await ProductsDao.update(id, newProduct, metadata);
	}

	async remove(
		id: GenericPrimaryKey,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await ProductsDao.remove(id, metadata);
	}

	async update(
		id: GenericPrimaryKey,
		data: ProductDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const product = new ProductModel(Object.assign(
			{},
			data,
			metadata && metadata.staticData || {},
		));
		const errors = await product.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await ProductsDao.update(id, product, metadata);
	}
}
