const mongoose = require('mongoose');

module.exports = {
	async up(db) {
		await db.collection('account_users').insertMany([
			{
				_id: new mongoose.Types.ObjectId('5eab004e22f583006bcff9d5'),
				createdAt: new Date('2020-04-29T17:57:39.000Z'),
				updatedAt: new Date('2020-04-30T09:47:36.000Z'),
				email: 'Rosalind_Lowe@hotmail.com',
				username: 'Mafalda.Morar',
				password: 'xyt8Z7_hvUt6gO6',
				groups: ['Super Admin'],
			},
		]);
	},

	async down(db) {
		await db.collection('account_users').remove();
	},
};