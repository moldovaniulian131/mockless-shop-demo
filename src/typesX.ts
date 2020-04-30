export interface GenericCondition {
	key: string;
	value: any;
}

export interface GenericFilter {
	property: string;
	value: any;
	op?: string;
}

export interface GenericOrder {
	[key: string]: OrderDirections;
}

export interface GenericPagination {
	limit: number;
	lastEvaluatedObject?: string;
	offset?: number;
}

export type OrderDirections = 'asc' | 'desc';

// @ts-ignore
export type GenericFilters = Array<GenericFilter | GenericFilters> | GenericFilter;

export interface GenericDaoErrorResponse {
	statusCode?: number;
	name?: string;
	message?: Error | string;
	meta?: {
		type: string;
		errors: any;
	};
}

export interface GenericDaoResponse {
	success: boolean;
	data?: any;
	size?: number;
	error?: GenericDaoErrorResponse;
	lastEvaluatedKey?: any;
}

export type GenericPrimaryKey = string | number;

export type GenericMetadataValue = string | number;
export type GenericMetadataPropertiesToReturn = GenericMetadataValue[];
export type GenericMetadataPropertiesToHide = GenericMetadataValue[];

export interface GenericMetadataQueryString {
	[key: string]: any;
}

export interface GenericMetadataParams {
	[key: string]: any;
}

export interface GenericMetadataStaticData {
	[key: string]: any;
}

export interface GenericMetadataNormalizedData {
	[key: string]: any;
}

export interface GenericExternalDataToLoad {
	sourceProperty: string;
	destinationProperty: string;
	entityName: string;
	meta?: GenericMetadata;
}

export interface GenericMetadataNestedRules {
	path: string;
	nestedPaths?: [GenericMetadataNestedRules];
}

export interface GenericMetadata {
	params?: GenericMetadataParams;
	queryString?: GenericMetadataQueryString;
	body?: any;
	propertiesToReturn?: GenericMetadataPropertiesToReturn;
	propertiesToHide?: GenericMetadataPropertiesToHide;
	externalDataToLoad?: GenericExternalDataToLoad[];
	staticData?: GenericMetadataStaticData;
	normalizedData?: GenericMetadataNormalizedData;
	nestedRules?: GenericMetadataNestedRules;
}
