export const normalizeBeforeUpdate = (mongooseModel: any) => {
	const document = mongooseModel.toJSON();

	delete document.id;
	delete document._id;
	delete document.createdAt;
	delete document.updatedAt;

	return document;
};
