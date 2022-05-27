const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
var webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';

console.log("MODE ", mode)
const prod = mode === 'production';

module.exports = {
	// entry: {
	// 	'static/bundle': ['./src/main.js'],
  //   'webpack-hot-middleware/client',
	// },
  entry: [
    './src/main.js',
    'webpack-hot-middleware/client',
  ],
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json'))
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.join(__dirname, '/public', '/build'),
		// filename: '[name].js',
		// chunkFilename: '[name].[id].js'
    	filename: 'bundle.js',
		chunkFilename: 'bundle.[id].js'
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: prod,
						// Enable HMR only for dev mode
						hotReload: true, // Default: false
						// Extra HMR options, the defaults are completely fine
						// You can safely omit hotOptions altogether
						hotOptions: {
							// Prevent preserving local component state
							preserveLocalState: false,

							// If this string appears anywhere in your component's code, then local
							// state won't be preserved, even when noPreserveState is false
							noPreserveStateKey: '@!hmr',

							// Prevent doing a full reload on next HMR update after fatal error
							noReload: false,

							// Try to recover after runtime errors in component init
							optimistic: false,

							// --- Advanced ---

							// Prevent adding an HMR accept handler to components with
							// accessors option to true, or to components with named exports
							// (from <script context="module">). This have the effect of
							// recreating the consumer of those components, instead of the
							// component themselves, on HMR updates. This might be needed to
							// reflect changes to accessors / named exports in the parents,
							// depending on how you use them.
							acceptAccessors: true,
							acceptNamedExports: true,
					  }
          }
        }
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader'
			// 	]
			// },
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(jpe?g|gif|png)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
        		},
			},
			{
                test: /\.css$/,
                use: [
                /**
                 * MiniCssExtractPlugin doesn't support HMR.
                 * For developing, use 'style-loader' instead.
                 * */
                prod ? MiniCssExtractPlugin.loader : 'style-loader',
                {
					loader: 'css-loader',
					options: {
					url: false,
					}
				} 
                ],
            },
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'

		}),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
	],
	devtool: prod ? false : 'source-map',
	devServer: {
		hot: true
	}
};