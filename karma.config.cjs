module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: process.cwd(),

		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['ChromeHeadless'],

		// list of files / patterns to load in the browser
		files: [
			'test/*.js',
			{
				pattern: 'main.js',
				watched: true,
				included: false,
				served: false
			},
		],

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha'],

		plugins: [
			'karma-*'
		],

		// web server port
		port: 9876,

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		babelPreprocessor: {
			options: {
				presets: [
					[
						require.resolve('@babel/preset-env'),
						{
							// https://docs.google.com/document/d/1z6kecy_o9qHYIznTmqQ-IJqre72jhfd0nVa4JMsS7Q4/
							"targets": {
								"safari": "11",
								"ios": "9",
								"ie": "11",
								"samsung": "9"
							}
						}
					]
				],
				configFile: false,
				envName: 'development',
				inputSourceMap: true,
				sourceMaps: 'inline',
				sourceType: 'script'
			},
		},
		preprocessors: {
			'test/*.js': ['esbuild', 'babel', 'sourcemap'],
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	});
};
