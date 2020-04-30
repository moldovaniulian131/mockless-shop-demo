import {
	GenericFilters,
	GenericOrder,
	GenericPagination,
} from '../../typesX';

export const applyPaginationRules = (
	query: any,
	paginationRules: GenericPagination,
) => {
	const {
		limit,
		offset,
	} = paginationRules;

	if (limit) {
		query.limit = limit;
	}

	if (offset) {
		query.skip = offset;
	}

	return query;
};

export const applyFilterRules = (
	groupQuery: any,
	filterRules: any,
) => {
	filterRules.forEach((filterRule: any) => {
		if (filterRule.length) {
			const or = {
				$or: Object.entries(applyFilterRules({
					$or: [],
				}, filterRule)).map(([property, value]) => ({
					[property === 'id' ? '_id' : property]: value,
				})),
			};

			if (!groupQuery.$and) {
				groupQuery.$and = [];
			}

			groupQuery.$and.push(or);
		} else {
			const { value } = filterRule;
			let { op, property } = filterRule;

			// Replace 'id' property name with '_id'
			if (property === 'id') {
				property = '_id';
				op = 'EQ';
			}

			if (!groupQuery.$or) {
				groupQuery.$or = [];
			}

			if (!op) {
				groupQuery.$or.push({
					[property]: value,
				});
			} else {
				switch (op) {
				case 'IN':
					groupQuery.$or.push({
						[property]: {
							$in: value,
						},
					});
					break;
				case 'NOT_IN':
					groupQuery.$or.push({
						[property]: {
							$nin: value,
						},
					});
					break;
				case 'NULL':
					groupQuery.$or.push({
						[property]: null,
					});
					break;
				case 'LIKE':
					groupQuery.$or.push({
						[property]: new RegExp(value, 'i'),
					});
					break;
				case 'BETWEEN':
					groupQuery.$or.push({
						[property]: {
							$gte: value[0],
							$lte: value[1],
						},
					});
					break;
				case 'GTE':
					groupQuery.$or.push({
						[property]: {
							$gte: value,
						},
					});
					break;
				case 'LTE':
					groupQuery.$or.push({
						[property]: {
							$lte: value,
						},
					});
					break;
				case 'NOT_BETWEEN':
					groupQuery.$or.push({
						[property]: {
							$not: {
								$gte: value[0],
								$lte: value[1],
							},
						},
					});
					break;
				case 'NOT':
					groupQuery.$or.push({
						[property]: {
							$ne: value,
						},
					});
					break;
				default:
					groupQuery.$or.push({
						[property]: value,
					});
					break;
				}
			}
		}
	});

	return groupQuery;
};

export const applyOrderRules = (
	query: any,
	orderRules: GenericOrder,
) => {
	Object.keys(orderRules).forEach((orderRuleName: string) => {
		query[orderRuleName] = orderRules[orderRuleName] === 'asc' ? 1 : -1;
	});

	return query;
};

export const applyGenericFilters = (
	model: any,
	paginationRules?: GenericPagination,
	filterRules?: GenericFilters,
	orderRules?: GenericOrder,
	metadataFilters?: any,
) => {
	let filters = metadataFilters ? {
		...metadataFilters,
	} : {};
	let limits: any = {};
	let sort = {};

	if (filterRules && Object.keys(filterRules).length) {
		filters = applyFilterRules(filters, filterRules);
	}

	if (paginationRules) {
		limits = applyPaginationRules(limits, paginationRules);
	}

	if (orderRules) {
		sort = applyOrderRules(sort, orderRules);
	}

	return model
		.find(filters)
		.limit(limits.limit)
		.skip(limits.skip)
		.sort(sort);
};
