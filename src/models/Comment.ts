import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import * as validators from '../helpers/mongoose/validators';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import {
	COMMENT_MESSAGE_LENGTH_10_5000,
} from '../constants';

export interface CommentDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  message: string;
}

export const CommentModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	message: {
		type: String,
		required: true,
		validate: [
			{
				validator: validators.length(10, 5000),
				msg: COMMENT_MESSAGE_LENGTH_10_5000,
			},
		],
	},
});

CommentModelSchema.plugin(timestamps);

export const CommentModel: any = normalizedValidator(
	'Comment',
	(() => {
		try {
			return mongoose.model('Comment');
		} catch (_err) {
			mongoose.model('Comment', CommentModelSchema, 'comments');

			return mongoose.model('Comment');
		}
	})(),
);

CommentModelSchema.set('toJSON', toJsonHelper());
		