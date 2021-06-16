const path = require( 'path' );

module.exports = {
	entry: path.resolve( __dirname, 'src/index.js' ),
	mode: 'development',
	devtool: 'eval-source-map',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'bundle.js',
		library: '$',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/
			}
		]
	},
	optimization: { minimize: false }
};