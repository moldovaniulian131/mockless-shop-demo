import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import * as validators from '../helpers/mongoose/validators';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import {
	ACCOUNT_USER_EMAIL_MATCHES,
	ACCOUNT_USER_USERNAME_LENGTH_3_30,
	ACCOUNT_USER_PASSWORD_MIN_LENGTH,
	ACCOUNT_USER_PASSWORD_MATCHES,
} from '../constants';

export interface AccountUserDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  cognitoId?: string;
  email: string;
  username: string;
  password?: string;
  groups: string[];
}

export const AccountUserModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	cognitoId: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
		validate: [
			{
				validator: validators.matches(/^\w[\w.-]*@([\w-]+\.)+[\w-]+$/gi),
				msg: ACCOUNT_USER_EMAIL_MATCHES,
			},
		],
	},
	username: {
		type: String,
		required: true,
		validate: [
			{
				validator: validators.length(3, 30),
				msg: ACCOUNT_USER_USERNAME_LENGTH_3_30,
			},
		],
	},
	password: {
		type: String,
		required: false,
		validate: [
			{
				validator: validators.minLength(6),
				msg: ACCOUNT_USER_PASSWORD_MIN_LENGTH,
			},
			{
				validator: validators.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&])./g),
				msg: ACCOUNT_USER_PASSWORD_MATCHES,
			},
		],
	},
	groups: [{
		type: String,
		required: true,
	}],
});

AccountUserModelSchema.plugin(timestamps);

export const AccountUserModel: any = normalizedValidator(
	'AccountUser',
	(() => {
		try {
			return mongoose.model('AccountUser');
		} catch (_err) {
			mongoose.model('AccountUser', AccountUserModelSchema, 'account_users');

			return mongoose.model('AccountUser');
		}
	})(),
);

AccountUserModelSchema.index({
	email: 1,
}, { unique: true });

AccountUserModelSchema.index({
	username: 1,
}, { unique: true });

AccountUserModelSchema.set('toJSON', toJsonHelper());
		