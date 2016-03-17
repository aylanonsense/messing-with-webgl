define([
	'global',
	'webgl/createProgramFromFiles',
	'util/loadFile'
], function(
	global,
	createProgramFromFiles,
	loadFile
) {
	return function() {
		//set up canvas to maintain aspect ration while being as big as possible
		var canvas = document.getElementById("canvas");
		window.addEventListener('resize', resizeCanvas, false);
		function resizeCanvas() {
			var size = Math.min(window.innerWidth / global.CANVAS_WIDTH,
				window.innerHeight / global.CANVAS_HEIGHT);
			canvas.width = size * global.CANVAS_WIDTH;
			canvas.height = size * global.CANVAS_HEIGHT;
		}
		resizeCanvas();

		//get A WebGL context
		var gl = canvas.getContext("experimental-webgl");
		if (!gl) {
			gl = canvas.getContext("webgl");
		}

		//setup a GLSL program
		program = createProgramFromFiles(gl, "simple", "simple", function(program) {
			gl.useProgram(program);

			//look up where the vertex data needs to go.
			var positionLocation = gl.getAttribLocation(program, "a_position");

			//create a buffer and put a single clipspace rectangle in it (2 triangles)
			var buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					-1.0, -1.0,
					 1.0, -1.0,
					-1.0,  1.0,
					-1.0,  1.0,
					 1.0, -1.0,
					 1.0,  1.0]),
				gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			//draw
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		});
	};
});