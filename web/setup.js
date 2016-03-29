//configure requirejs
requirejs.config({
	baseUrl: 'javascripts/client',
	paths: {
		'shared': '../shared',
		'gl-matrix': '/lib/gl-matrix',
		'noisejs': '/lib/noisejs',
		'socket.io': '../../socket.io/socket.io',
		'cookies-js': '/lib/cookies-js'
	},
	shim: {
		'noisejs': {
			exports: 'Noise'
		},
		'socket.io': {
			exports: 'io'
		}
	}
});

//execute the main class
requirejs([ 'main' ], function(main) {
	main();
});