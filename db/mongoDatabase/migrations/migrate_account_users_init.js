module.exports = {
	async up(db) {
		await db.createCollection('account_users');
	},

	async down(db) {
		await db.collection('account_users').drop();
	},
};