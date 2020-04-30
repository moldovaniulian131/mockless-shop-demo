import {
	Length,
} from 'class-validator';
import {
	ACCOUNT_LOGIN_USERNAME_LENGTH_3_30,
	ACCOUNT_LOGIN_PASSWORD_LENGTH_3_30,
} from '../constants';
import {
	ClassValidatorDefinition,
	ClassValidator,
} from '../helpers/classValidator/ClassValidatorModel';

export interface AccountLoginDefinition extends ClassValidatorDefinition {
  username: string;
  password: string;
}

export class AccountLoginModel extends ClassValidator {
  @Length(3, 30, {
  	message: ACCOUNT_LOGIN_USERNAME_LENGTH_3_30,
  })
  username: string;

  @Length(3, 30, {
  	message: ACCOUNT_LOGIN_PASSWORD_LENGTH_3_30,
  })
  password: string;

  constructor(accountLogin: AccountLoginDefinition) {
  	super();
		
  	this.username = accountLogin.username;
  	this.password = accountLogin.password;
  }
}
		