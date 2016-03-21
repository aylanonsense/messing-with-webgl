//configure requirejs
requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		'gl-matrix': '/lib/gl-matrix'
	}
});

//execute the main class
requirejs([ 'main' ], function(main) {
	main();
});