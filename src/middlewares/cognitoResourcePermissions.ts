import * as express from 'express';
import {
	HandleResourcePermissions,
	AuthorizedRequest,
	GenericRequest,
} from '../helpers/cognitoExpress/typesX';
import ErrorHandler from '../utils/ErrorHandler';

export const getFirstIntersection = (requiredAttrs?: string[], existentAttrs?: string[]) => {
	if (!requiredAttrs || !existentAttrs) {
		return;
	}

	return requiredAttrs.find((attr: string) => existentAttrs.indexOf(attr) !== -1);
};

export default ({
	requiredGroups,
	requiredRoles,
	optional,
}: HandleResourcePermissions = {}) => (
	req: GenericRequest,
	_res: express.Response,
	next: express.NextFunction,
) => {
	if (!requiredGroups && !requiredRoles) {
		next();
	} else {
		const {
			authUserGroups,
			authUserRoles,
		} = (req as AuthorizedRequest);

		const authorizedGroup = getFirstIntersection(requiredGroups, authUserGroups);
		const authorizedRoles = getFirstIntersection(requiredRoles, authUserRoles);

		if (!authorizedGroup && !authorizedRoles && !optional) {
			next(ErrorHandler.unauthorized('RESOURCE_ACCESS_DENIED'));
		} else {
			(req as AuthorizedRequest).authUserGroup = authorizedGroup;
			(req as AuthorizedRequest).authUserRole = authorizedRoles;

			next();
		}
	}
};
