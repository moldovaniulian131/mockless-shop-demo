module.exports = {
	async up(db) {
		await db.createCollection('carts');
	},

	async down(db) {
		await db.collection('carts').drop();
	},
};