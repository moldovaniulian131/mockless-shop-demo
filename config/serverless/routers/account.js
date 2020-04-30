module.exports = {
	handler: 'src/routers/account.serverlessHandler',
	warmup: true,
	timeout: 30,
	events: [
		{
			http: {
				path: '/account/register',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/register/confirm',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/register/resend-code',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/login',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/logout',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/password/recover',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/password/recover/confirm',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/password/change',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/account/token/renew',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
	],
};