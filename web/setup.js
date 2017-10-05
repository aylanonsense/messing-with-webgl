//configure requirejs
requirejs.config({
	baseUrl: BASE_URL + '/javascripts/client',
	paths: {
		'shared': '../shared',
		'gl-matrix': '../../lib/gl-matrix',
		'noisejs': '../../lib/noisejs'
	},
	shim: {
		'noisejs': {
			exports: 'Noise'
		}
	}
});

//execute the main class
requirejs([ 'main' ], function(main) {
	main();
});