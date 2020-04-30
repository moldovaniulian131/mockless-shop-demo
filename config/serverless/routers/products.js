module.exports = {
	handler: 'src/routers/products.serverlessHandler',
	warmup: true,
	timeout: 30,
	events: [
		{
			http: {
				path: '/products',
				method: 'GET',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/products',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},

		{
			http: {
				path: '/products/{productId}',
				method: 'GET',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/products/{productId}',
				method: 'DELETE',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/products/{productId}',
				method: 'PUT',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
		{
			http: {
				path: '/products/{productId}',
				method: 'PATCH',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},

		{
			http: {
				path: '/products/filter',
				method: 'POST',
				cors: {
					origin: '${self:custom.allowedOrigins}',
					headers: '${self:custom.allowedHeaders}',
				},
			},
		},
	],
};
