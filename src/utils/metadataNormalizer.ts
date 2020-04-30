import {
	GenericMetadata,
} from '../typesX';

const DEFAULT_PROPERTY = 'defaultConfig';

export const subtractMetadata = (metadata: any, group?: string): GenericMetadata => {
	if (!metadata) {
		return {};
	}

	group = group || DEFAULT_PROPERTY;
	const groupMetadata = metadata[group];

	if (!groupMetadata) {
		return {};
	}

	return groupMetadata;
};

export const updateStaticMetadataVariables = (data: any, req: any) => {
	const metadata: GenericMetadata = req.metadata || {};
	const newData = Object.assign({}, data);
	const regexp = /\${([a-zA-Z0-9._-]{1,100})}/gmi;

	Object.keys(metadata.staticData || {}).forEach((propertyName: string) => {
		const value = (metadata.staticData as any)[propertyName];

		if (value && value.match && value.match(regexp) !== -1) {
			const match = regexp.exec(value);

			if (match) {
				newData[propertyName] = eval(match[1]);
			} else {
				newData[propertyName] = value;
			}
		} else {
			newData[propertyName] = value;
		}
	});

	return newData;
};

export const mergeStaticMetadata = (data: any, metadata: GenericMetadata = {}) => {
	if (Array.isArray(data)) {
		return data.map((item: any) =>
			Object.assign({}, item, metadata.staticData || {}, metadata.params || {}));
	}

	return Object.assign({}, data, metadata.staticData || {}, metadata.params || {});
};
