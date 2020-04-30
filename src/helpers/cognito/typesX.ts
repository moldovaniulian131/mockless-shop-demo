import { GenericMetadata } from '../../typesX';

export interface CognitoAttributes {
	[key: string]: string | string[];
}

export interface CognitoController {
	userPoolIdentifierPrefix?: string;
	metadata?: GenericMetadata;
}
