module.exports = {
	handler: 'src/routers/accountUsers.serverlessHandler',
	warmup: true,
	timeout: 30,
	events: [
		{
			http: {
				path: '/account/user',
				method: 'GET',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/user',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},

		{
			http: {
				path: '/account/user/{accountUserId}',
				method: 'GET',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/user/{accountUserId}',
				method: 'DELETE',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/user/{accountUserId}',
				method: 'PUT',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/user/{accountUserId}',
				method: 'PATCH',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},

		{
			http: {
				path: '/account/user/filter',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
	],
};
