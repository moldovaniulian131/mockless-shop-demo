import {
	Allow,
	validate,
} from 'class-validator';
import { VALIDATION_ERROR_TYPE } from '../../constants';
import i18n from '../../helpers/i18n';

export interface ClassValidatorDefinition {
	runValidations: any;
}

export class ClassValidator {
	@Allow()
	runValidations: any;
}

ClassValidator.prototype.runValidations = function() {
	return validate(this, {
		validationError: {
			target: false,
		},
	}).then((response: any) => {
		if (!response.length) {
			return null;
		}

		return {
			type: VALIDATION_ERROR_TYPE,
			errors: response.map((validationError: any) => {

				return Object.assign({}, validationError, {
					constraints: Object.keys(validationError.constraints).map((constraintName) => {
						return {
							code: validationError.constraints[constraintName],
							message: i18n.__(validationError.constraints[constraintName]),
						};
					}),
				});
			}),
		};
	});
};

export const classValidatorModel = (model: any, validatorClass: any) => {
	model.prototype.runValidations = function() {
		return new validatorClass(this).runValidations();
	};

	return model;
};
