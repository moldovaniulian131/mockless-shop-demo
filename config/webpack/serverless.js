const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	bail: true,
	target: 'node',
	mode: 'none',
	externals: [ nodeExternals({
		modulesDir: path.resolve(__dirname, '../../node_modules'),
	}) ],
	entry: slsw.lib.entries,
	resolve: {
		extensions: ['.js', '.json', '.ts', '.tsx'],
	},
	output: {
		libraryTarget: 'commonjs',
		path: path.join(__dirname, '../../.webpack'),
		filename: '[name].js',
		sourceMapFilename: '[file].map',
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
			{
				test: /\.js$/,
				loaders: [ 'babel-loader' ],
				exclude: /node_modules/,
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin([path.join(__dirname, '../../locales/**')]),
	],
};
