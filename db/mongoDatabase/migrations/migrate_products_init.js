module.exports = {
	async up(db) {
		await db.createCollection('products');
	},

	async down(db) {
		await db.collection('products').drop();
	},
};