import {
	Length,
} from 'class-validator';
import {
	ACCOUNT_PASSWORD_CHANGE_USERNAME_LENGTH_3_30,
	ACCOUNT_PASSWORD_CHANGE_PASSWORD_LENGTH_3_30,
	ACCOUNT_PASSWORD_CHANGE_NEW_PASSWORD_LENGTH_3_30,
} from '../constants';
import {
	ClassValidatorDefinition,
	ClassValidator,
} from '../helpers/classValidator/ClassValidatorModel';

export interface AccountPasswordChangeDefinition extends ClassValidatorDefinition {
  username: string;
  password: string;
  newPassword: string;
}

export class AccountPasswordChangeModel extends ClassValidator {
  @Length(3, 30, {
  	message: ACCOUNT_PASSWORD_CHANGE_USERNAME_LENGTH_3_30,
  })
  username: string;

  @Length(3, 30, {
  	message: ACCOUNT_PASSWORD_CHANGE_PASSWORD_LENGTH_3_30,
  })
  password: string;

  @Length(3, 30, {
  	message: ACCOUNT_PASSWORD_CHANGE_NEW_PASSWORD_LENGTH_3_30,
  })
  newPassword: string;

  constructor(accountPasswordChange: AccountPasswordChangeDefinition) {
  	super();
		
  	this.username = accountPasswordChange.username;
  	this.password = accountPasswordChange.password;
  	this.newPassword = accountPasswordChange.newPassword;
  }
}
		