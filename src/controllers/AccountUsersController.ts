import * as AccountUsersDao from '../dao/AccountUsersDao';
import {
	AccountUserDefinition,
	AccountUserModel,
} from '../models/AccountUser';
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

export default class AccountUsersController {
	async add(
		accountUserData: AccountUserDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const accountUser = new AccountUserModel(Object.assign(
			{},
			accountUserData,
			metadata && metadata.staticData || {},
		));
		const errors = await accountUser.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await AccountUsersDao.add(accountUser, metadata);
	}
	
	async bulkAdd(
		accountUserData: AccountUserDefinition[],
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const errorsList: any = [];
		const accountUserModels: any = [];
		const responses: any = [];
		
		for (let i = 0; i < accountUserData.length; i++) {
			const data = accountUserData[i];

			const model = new AccountUserModel(Object.assign(
				{},
				data,
				metadata && metadata.staticData || {},
			));

			const errors = await model.runValidations();

			if (errors) {
				errorsList.push(errors);
			} else {
				accountUserModels.push(model);
			}
		}

		if (errorsList.length) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errorsList);
		}

		for (let i = 0; i < accountUserModels.length; i++) {
			responses.push(await AccountUsersDao.add(accountUserModels[i], metadata));
		}

		return {
			success: true,
			data: responses,
		};
	}

	async getAll(
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await AccountUsersDao.getAll(metadata);
	}

	async getById(
		id: GenericPrimaryKey,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await AccountUsersDao.getById(id, metadata);
	}

	async getFilteredData(
		paginationRules?: GenericPagination,
		filterRules?: GenericFilters,
		orderRules?: GenericOrder,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const sizeResponse = await AccountUsersDao.getFilteredSize(filterRules);
		const dataResponse = await AccountUsersDao.getFiltered(paginationRules, filterRules, orderRules, metadata);

		return Object.assign({}, dataResponse, {
			size: sizeResponse.data,
		});
	}

	async patch(
		id: GenericPrimaryKey,
		data: AccountUserDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const oldAccountUserResponse: GenericDaoResponse = await this.getById(id);
		const oldAccountUserData = oldAccountUserResponse.data && oldAccountUserResponse.data[0];
		const newAccountUser = new AccountUserModel(Object.assign(
			{},
			oldAccountUserData,
			data,
			metadata && metadata.staticData || {},
		));
	
		const errors = await newAccountUser.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await AccountUsersDao.update(id, newAccountUser, metadata);
	}

	async remove(
		id: GenericPrimaryKey,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return await AccountUsersDao.remove(id, metadata);
	}

	async update(
		id: GenericPrimaryKey,
		data: AccountUserDefinition,
		metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const accountUser = new AccountUserModel(Object.assign(
			{},
			data,
			metadata && metadata.staticData || {},
		));
		const errors = await accountUser.runValidations();
	
		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}
	
		return await AccountUsersDao.update(id, accountUser, metadata);
	}
}
