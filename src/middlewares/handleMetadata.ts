import * as express from 'express';
import {
	mergeStaticMetadata,
	subtractMetadata,
	updateStaticMetadataVariables,
} from '../utils/metadataNormalizer';

export const getFirstIntersection = (requiredAttrs?: string[], existentAttrs?: string[]) => {
	if (!requiredAttrs || !existentAttrs) {
		return;
	}

	return requiredAttrs.find((attr: string) => existentAttrs.indexOf(attr) !== -1);
};

export default ({
	metadata,
	params,
	nestedRules,
}: any = {}) => (
	req: any,
	_res: express.Response,
	next: express.NextFunction,
) => {
	const {
		authUserGroup,
		body,
		query,
		body: {
			propertiesToReturn,
			propertiesToHide,
		},
	} = req;

	req.metadata = subtractMetadata(metadata, authUserGroup);
	req.metadata.queryString = query;
	req.metadata.body = body;

	if (propertiesToReturn) {
		req.metadata.propertiesToReturn = propertiesToReturn;
	}

	if (nestedRules) {
		req.metadata.nestedRules = nestedRules;
	}

	if (params) {
		req.metadata.params = params.reduce((result: any, paramName: string) => {
			result[paramName] = req.params[paramName];

			return result;
		}, {});
	}

	if (propertiesToHide) {
		req.metadata.propertiesToHide = propertiesToHide;
	}

	req.metadata.staticData = updateStaticMetadataVariables(req.metadata.staticData, req);
	req.normalizedData = mergeStaticMetadata(body, req.metadata);

	next();
};
