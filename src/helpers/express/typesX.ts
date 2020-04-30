import express from 'express';
import { GenericMetadata } from '../../typesX';

export interface Request extends express.Request {
	metadata?: GenericMetadata;
	normalizedData?: any;
}

export type UnauthorizedRequest = Request;

export type GenericRequest = UnauthorizedRequest;
