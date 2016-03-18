define([
	'global',
	'drawStuff',
	'webgl/createProgramFromFiles',
	'util/loadFile'
], function(
	global,
	drawStuff,
	createProgramFromFiles,
	loadFile
) {
	return function() {
		//set up canvas to maintain aspect ration while being as big as possible
		var canvas = document.getElementById('canvas');
		window.addEventListener('resize', resizeCanvas, false);
		function resizeCanvas() {
			var size = Math.min(window.innerWidth / global.CANVAS_WIDTH,
				window.innerHeight / global.CANVAS_HEIGHT);
			canvas.width = size * global.CANVAS_WIDTH;
			canvas.height = size * global.CANVAS_HEIGHT;
		}
		resizeCanvas();

		//get A WebGL context
		var gl = canvas.getContext('experimental-webgl');
		if (!gl) {
			gl = canvas.getContext('webgl');
		}

		//setup a GLSL program
		program = createProgramFromFiles(gl, '2d', '2d', function(program) {
			gl.useProgram(program);
			drawStuff(gl, program, canvas);
		});
	};
});