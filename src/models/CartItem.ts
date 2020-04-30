import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import * as validators from '../helpers/mongoose/validators';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import {
	CART_ITEM_QUANTITY_IS_POSITIVE,
	CART_ITEM_QUANTITY_MIN,
	CART_ITEM_QUANTITY_MAX,
} from '../constants';
import './Product';

export interface CartItemDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  productId: string;
  quantity: number;
}

export const CartItemModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	productId: {
		type: String,
		ref: 'Product',
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		validate: [
			{
				validator: validators.isPositive,
				msg: CART_ITEM_QUANTITY_IS_POSITIVE,
			},
			{
				validator: validators.min(1),
				msg: CART_ITEM_QUANTITY_MIN,
			},
			{
				validator: validators.max(1000),
				msg: CART_ITEM_QUANTITY_MAX,
			},
		],
	},
});

CartItemModelSchema.plugin(timestamps);

export const CartItemModel: any = normalizedValidator(
	'CartItem',
	(() => {
		try {
			return mongoose.model('CartItem');
		} catch (_err) {
			mongoose.model('CartItem', CartItemModelSchema, 'cart_items');

			return mongoose.model('CartItem');
		}
	})(),
);

CartItemModelSchema.set('toJSON', toJsonHelper());
		