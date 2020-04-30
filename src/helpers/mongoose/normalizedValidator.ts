import * as changeCase from 'change-case';
import i18n from '../../helpers/i18n';

export const normalizedValidator = (modelName: string, model: any) => {
	model.prototype.runValidations = function (this: any) {
		return validator.call(this, modelName);
	};

	return model;
};

export async function validator(this: any, modelName: string) {
	try {
		await this.validate(this);

		return null;
	} catch (e) {
		return {
			type: 'VALIDATION_ERROR',
			errors: Object.keys(e.errors).map((property: any) => {
				const error = e.errors[property];

				const errorName = error.kind === 'required'
					? `${changeCase.constantCase(modelName)}_${changeCase.constantCase(property)}_REQUIRED`
					: error.message;

				return {
					property,
					value: error.value,
					constraints: [
						{
							code: errorName,
							message: i18n.__(errorName),
						},
					],
				};
			}),
		};
	}
}
