import express from 'express';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { GenericMetadata } from '../../typesX';

export interface HandleAuthConfig {
	optional?: boolean;
}

export interface HandleResourcePermissions {
	requiredGroups?: string[];
	requiredRoles?: string[];
	optional?: boolean;
}

export interface Request extends express.Request {
	metadata?: GenericMetadata;
	normalizedData?: any;
}

export type UnauthorizedRequest = Request;

export interface AuthorizedRequest extends Request {
	authUser: CognitoUser;
	authUserAttributes: any;
	authUserGroups?: string[];
	authUserRoles?: string[];
	authUserGroup?: string;
	authUserRole?: string;
}

export type GenericRequest = AuthorizedRequest | UnauthorizedRequest;
