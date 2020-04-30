import {
	AccountUserDefinition,
	AccountUserModel,
} from '../models/AccountUser';
import {
	AccountLoginDefinition,
	AccountLoginModel,
} from '../models/AccountLogin';
import {
	AccountPasswordChangeDefinition,
	AccountPasswordChangeModel,
} from '../models/AccountPasswordChange';
import {
	AccountPasswordRecoverDefinition,
	AccountPasswordRecoverModel,
} from '../models/AccountPasswordRecover';
import ErrorHandler from '../utils/ErrorHandler';
import {CognitoController} from '../helpers/cognito/typesX';
import * as AccountUserDao from '../dao/AccountUsersDao';
import {
	GenericDaoResponse,
	GenericMetadata,
} from '../typesX';
import {
	CognitoUser,
	CognitoUserPool,
} from 'amazon-cognito-identity-js';
import {
	getUserPool,
	getCognitoUser,
} from '../helpers/cognito/client';
import CognitoRegister, {
	CognitoConfirmRegister,
	CognitoResendRegisterCode,
} from '../helpers/cognito/account/register';
import CognitoLogin from '../helpers/cognito/account/login';
import CognitoLogout from '../helpers/cognito/account/logout';
import {
	changePassword as changePasswordService,
	recoverPassword as recoverPasswordService,
	recoverPasswordConfirm as recoverPasswordConfirmService,
} from '../helpers/cognito/account/password';
import {
	validateToken as validateTokenService,
	renewToken as renewTokenService,
} from '../helpers/cognito/token';
import { UNPROCESSABLE_ENTITY } from '../constants';

const DEFAULT_USER_POLL_IDENTIFIER_PREFIX = 'ACCOUNT';

export default class AccountController {
	userPool: CognitoUserPool;
	userPoolIdentifierPrefix: string;

	constructor({
		userPoolIdentifierPrefix,
	}: CognitoController = {}) {
		this.userPoolIdentifierPrefix = userPoolIdentifierPrefix || DEFAULT_USER_POLL_IDENTIFIER_PREFIX;
		this.userPool = getUserPool(this.userPoolIdentifierPrefix);
	}

	async register(
		data: AccountUserDefinition,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const user = new AccountUserModel(data);
		const errors = await user.runValidations();

		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}

		const cognitoResponse = await CognitoRegister(this.userPool, user);
		
		if (!cognitoResponse.success) {
			return cognitoResponse;
		}
		
		return await AccountUserDao.add(new AccountUserModel(Object.assign({}, user.toJSON(), {
			cognitoId: cognitoResponse.data.userSub,
			password: undefined,
		})));
	}

	async confirmRegister(
		username: string,
		verificationCode: string,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const user = getCognitoUser(this.userPool, username);

		return CognitoConfirmRegister(user, verificationCode);
	}

	async resendRegisterCode(
		username: string,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const user = getCognitoUser(this.userPool, username);

		return CognitoResendRegisterCode(user);
	}

	async login(
		data: AccountLoginDefinition,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const userLogin = new AccountLoginModel(data);
		const errors = await userLogin.runValidations();
		const cognitoUser = getCognitoUser(this.userPool, userLogin.username);

		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}

		return CognitoLogin(cognitoUser, userLogin);
	}

	async logout(
		user: CognitoUser,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		return CognitoLogout(user);
	}

	async changePassword(
		data: AccountPasswordChangeDefinition,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const userPasswordChange = new AccountPasswordChangeModel(data);
		const errors = await userPasswordChange.runValidations();
		const cognitoUser = getCognitoUser(this.userPool, userPasswordChange.username);

		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}

		return changePasswordService(cognitoUser, userPasswordChange);
	}

	async recoverPassword(
		data: AccountPasswordRecoverDefinition,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const userPasswordRecover = new AccountPasswordRecoverModel(data);
		const errors = await userPasswordRecover.runValidations();
		const cognitoUser = getCognitoUser(this.userPool, userPasswordRecover.username);

		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}

		return recoverPasswordService(cognitoUser);
	}

	async recoverPasswordConfirm(
		data: AccountPasswordRecoverDefinition,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const userPasswordRecover = new AccountPasswordRecoverModel(data);
		const errors = await userPasswordRecover.runValidations();
		const cognitoUser = getCognitoUser(this.userPool, userPasswordRecover.username);

		if (errors) {
			throw ErrorHandler.badData(UNPROCESSABLE_ENTITY, errors);
		}

		return recoverPasswordConfirmService(cognitoUser, userPasswordRecover);
	}

	async validateToken(token: string): Promise<GenericDaoResponse> {
		return validateTokenService(this.userPoolIdentifierPrefix, token);
	}

	async renewToken(
		token: string,
		_metadata?: GenericMetadata,
	): Promise<GenericDaoResponse> {
		const cognitoUser = getCognitoUser(this.userPool, '');

		return renewTokenService(cognitoUser, token);
	}
}
