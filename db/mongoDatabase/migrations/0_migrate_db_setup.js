module.exports = {
	async up(db) {
		try {
			await db.addUser('admin', 'admin', { roles: ['readWrite'] });
		} catch (e) {
			console.error(e);
		}
	},

	async down(db) {
		await db.removeUser('admin');
	},
};