import { resolve } from 'path';
import { Configuration, optimize } from 'webpack';

const distPath = '../../site/themes/dojo/source/js';

const config: Configuration = {
	devtool: 'source-map',
	entry: ['whatwg-fetch', './src/doc_viewer.ts'],
	output: {
		filename: 'doc_viewer.js',
		path: resolve(distPath)
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					silent: true
				}
			}
		]
	},
	plugins: [],
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		modules: [resolve('./src'), resolve('./node_modules')],
		alias: {
			// A module requesting highlight.js will load just the bare
			// highlighter, and will then register languages of interest
			'highlight.js$': resolve(
				'./node_modules/highlight.js/lib/highlight.js'
			)
		}
	}
};

if (process.env.NODE_ENV === 'production') {
	// config.plugins = [new optimize.UglifyJsPlugin()];
}

// CommonsChunk needs to come after UglifyJs to prevent the chunks from being
// merged
config.plugins!.push(
	new optimize.CommonsChunkPlugin({
		name: 'dependencies.js',
		filename: 'dependencies.js',
		minChunks: module => /node_modules/.test(module.resource)
	})
);

export default config;
