import {
	GenericMetadata,
	GenericMetadataNestedRules,
} from '../../typesX';

const formatPropertiesObject = (properties: any, obj: any, inclExcl: number) => {
	if (!properties.length) {
		return obj;
	}

	return properties.reduce((reduced: any, property: string) => {
		reduced[property] = inclExcl;

		return reduced;
	}, obj);
};

export const selectMetadataRequiredProperties = (model: any, metadata?: GenericMetadata) => {
	const propertiesToReturn = (metadata && metadata.propertiesToReturn) as any || [];
	const propertiesToHide = (metadata && metadata.propertiesToHide) as any || [];

	if (!propertiesToReturn.length && !propertiesToHide.length) {
		return model;
	}

	return model.select(
		formatPropertiesObject(
			propertiesToHide,
			formatPropertiesObject(
				propertiesToReturn,
				{},
				1,
			),
			0,
		),
	);
};

export const getMetadataFilters = (metadata?: GenericMetadata) => {
	const params = metadata && metadata.params || [];
	const filters: any = {};

	Object.keys(params).forEach((param: string) => {
		filters[param] = params[param];
	});

	return filters;
};

export const restrictMetadataStaticProperties = (model: any, metadata?: GenericMetadata) => {
	const staticData = (metadata && metadata.staticData) as any || {};

	const filters = Object.keys(staticData).map((property: string) => ({[property]: staticData[property]}));

	if (filters && filters.length) {
		return model.and(filters);
	}

	return model;
};

export const addMetadataNestedRules = (model: any, metadata?: GenericMetadata) => {
	const nestedRules = (metadata && metadata.nestedRules) as any || [];

	function makePopulatePath(nestedPaths?: GenericMetadataNestedRules[]) {
		if (!nestedPaths) {
			return;
		}

		return nestedPaths.map(({
			path,
			nestedPaths,
		}) => {
			return {
				path: path,
				populate: addMetadataNestedRules(nestedPaths),
			};
		});
	}

	if (nestedRules && nestedRules.length) {
		nestedRules.forEach(({
			path,
			nestedPaths,
		}: GenericMetadataNestedRules) => {
			model = model.populate({
				path,
				populate: makePopulatePath(nestedPaths),
			});
		});
	}

	return model;
};

export const filterByMetadataParams = (model: any, metadata?: GenericMetadata) => {
	return model.find(getMetadataFilters(metadata));
};
