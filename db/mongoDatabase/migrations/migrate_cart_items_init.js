module.exports = {
	async up(db) {
		await db.createCollection('cart_items');
	},

	async down(db) {
		await db.collection('cart_items').drop();
	},
};