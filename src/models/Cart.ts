import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import './AccountUser';
import './CartItem';

export interface CartDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  items: string[];
}

export const CartModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	userId: {
		type: String,
		ref: 'AccountUser',
		required: true,
	},
	items: [{
		type: String,
		ref: 'CartItem',
		required: true,
	}],
});

CartModelSchema.plugin(timestamps);

export const CartModel: any = normalizedValidator(
	'Cart',
	(() => {
		try {
			return mongoose.model('Cart');
		} catch (_err) {
			mongoose.model('Cart', CartModelSchema, 'carts');

			return mongoose.model('Cart');
		}
	})(),
);

CartModelSchema.set('toJSON', toJsonHelper());
		