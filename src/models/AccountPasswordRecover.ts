import {
	Length,
	IsOptional,
} from 'class-validator';
import {
	ACCOUNT_PASSWORD_RECOVER_USERNAME_LENGTH_3_30,
} from '../constants';
import {
	ClassValidatorDefinition,
	ClassValidator,
} from '../helpers/classValidator/ClassValidatorModel';

export interface AccountPasswordRecoverDefinition extends ClassValidatorDefinition {
  username: string;
  newPassword?: string;
  verificationCode?: string;
}

export class AccountPasswordRecoverModel extends ClassValidator {
  @Length(3, 30, {
  	message: ACCOUNT_PASSWORD_RECOVER_USERNAME_LENGTH_3_30,
  })
  username: string;

  @IsOptional()
  newPassword?: string;

  @IsOptional()
  verificationCode?: string;

  constructor(accountPasswordRecover: AccountPasswordRecoverDefinition) {
  	super();
		
  	this.username = accountPasswordRecover.username;
  	this.newPassword = accountPasswordRecover.newPassword;
  	this.verificationCode = accountPasswordRecover.verificationCode;
  }
}
		