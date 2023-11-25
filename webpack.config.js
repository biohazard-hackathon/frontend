const path = require('path');

module.exports = {
	mode: 'development',
	output: {
		path: path.join(__dirname, 'www/js'),
		filename: 'app-main.js',
		publicPath: 'js',
	},
	module: {
		rules: [
			{
				test: /\.(graphql|gql)$/,
				use: 'graphql-tag/loader',
			},
			{
				test: /\.(ts|tsx)?$/,
				exclude: /node_modules/,
				use: ['ts-loader'],
			},
			{
				test: /\\.(png|jp(e*)g|svg|gif)$/,
				use: ['file-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader',]
			  }
		],
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.mdx'],
	},
	plugins: [],
};
