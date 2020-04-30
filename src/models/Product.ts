import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import * as validators from '../helpers/mongoose/validators';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import {
	PRODUCT_TITLE_LENGTH_10_80,
	PRODUCT_PRICE_IS_POSITIVE,
} from '../constants';
import {CommentDefinition, CommentModelSchema} from './Comment';

export interface ProductDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  price: number;
  comments?: CommentDefinition[];
}

export const ProductModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	title: {
		type: String,
		required: true,
		validate: [
			{
				validator: validators.length(10, 80),
				msg: PRODUCT_TITLE_LENGTH_10_80,
			},
		],
	},
	price: {
		type: Number,
		required: true,
		validate: [
			{
				validator: validators.isPositive,
				msg: PRODUCT_PRICE_IS_POSITIVE,
			},
		],
	},
	comments: [{
		type: CommentModelSchema,
		required: false,
	}],
});

ProductModelSchema.plugin(timestamps);

export const ProductModel: any = normalizedValidator(
	'Product',
	(() => {
		try {
			return mongoose.model('Product');
		} catch (_err) {
			mongoose.model('Product', ProductModelSchema, 'products');

			return mongoose.model('Product');
		}
	})(),
);

ProductModelSchema.set('toJSON', toJsonHelper());
		