define([
	'display/canvas',
	'gl-matrix',
	'input/mouse'
], function(
	canvas,
	glMatrix,
	mouse
) {
	var UP = [ 0, 1, 0 ];

	function Game(gl, program) {
		var buffer;

		//configure WebGL
		gl.useProgram(program);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		//look up shader variables
		var positionLocation = gl.getAttribLocation(program, "a_position");
		var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.matrixLocation = gl.getUniformLocation(program, "u_matrix");

		//create a buffer
		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		var positions = new Float32Array([
			//left column front
			200, 0, 0,
			200, 150, 0,
			230, 0, 0,
			200, 150, 0,
			230, 150, 0,
			230, 0, 0,

			//top rung front
			230, 0, 0,
			230, 30, 0,
			300, 0, 0,
			230, 30, 0,
			300, 30, 0,
			300, 0, 0,

			//middle rung front
			230, 60, 0,
			230, 90, 0,
			267, 60, 0,
			230, 90, 0,
			267, 90, 0,
			267, 60, 0,

			//left column back
			200, 0, 30,
			230, 0, 30,
			200, 150, 30,
			200, 150, 30,
			230, 0, 30,
			230, 150, 30,

			//top rung back
			230, 0, 30,
			300, 0, 30,
			230, 30, 30,
			230, 30, 30,
			300, 0, 30,
			300, 30, 30,

			//middle rung back
			230, 60, 30,
			267, 60, 30,
			230, 90, 30,
			230, 90, 30,
			267, 60, 30,
			267, 90, 30,

			//top
			200, 0, 0,
			300, 0, 0,
			300, 0, 30,
			200, 0, 0,
			300, 0, 30,
			200, 0, 30,

			//top rung right
			300, 0, 0,
			300, 30, 0,
			300, 30, 30,
			300, 0, 0,
			300, 30, 30,
			300, 0, 30,

			//under top rung
			230, 30, 0,
			230, 30, 30,
			300, 30, 30,
			230, 30, 0,
			300, 30, 30,
			300, 30, 0,

			//between top rung and middle
			230, 30, 0,
			230, 60, 30,
			230, 30, 30,
			230, 30, 0,
			230, 60, 0,
			230, 60, 30,

			//top of middle rung
			230, 60, 0,
			267, 60, 30,
			230, 60, 30,
			230, 60, 0,
			267, 60, 0,
			267, 60, 30,

			//right of middle rung
			267, 60, 0,
			267, 90, 30,
			267, 60, 30,
			267, 60, 0,
			267, 90, 0,
			267, 90, 30,

			//bottom of middle rung
			230, 90, 0,
			230, 90, 30,
			267, 90, 30,
			230, 90, 0,
			267, 90, 30,
			267, 90, 0,

			//right of bottom
			230, 90, 0,
			230, 150, 30,
			230, 90, 30,
			230, 90, 0,
			230, 150, 0,
			230, 150, 30,

			//bottom
			200, 150, 0,
			200, 150, 30,
			230, 150, 30,
			200, 150, 0,
			230, 150, 30,
			230, 150, 0,

			//left side
			200, 0, 0,
			200, 0, 30,
			200, 150, 30,
			200, 0, 0,
			200, 150, 30,
			200, 150, 0
		]);
		var matrix = glMatrix.mat4.translate([], glMatrix.mat4.identity([]), [ -50, -175, -15 ]);
		for(var i = 0; i < positions.length; i += 3) {
			var vector = [ positions[i + 0], positions[i + 1], positions[i + 2] ];
			glMatrix.vec3.transformMat4(vector, vector, matrix);
			positions[i + 0] = vector[0];
			positions[i + 1] = vector[1];
			positions[i + 2] = vector[2];
		}
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		//create a buffer for texcoords
		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			//left column front
			0.22, 0.19,
			0.22, 0.79,
			0.34, 0.19,
			0.22, 0.79,
			0.34, 0.79,
			0.34, 0.19,

			//top rung front
			0.34, 0.19,
			0.34, 0.31,
			0.62, 0.19,
			0.34, 0.31,
			0.62, 0.31,
			0.62, 0.19,

			//middle rung front
			0.34, 0.43,
			0.34, 0.55,
			0.49, 0.43,
			0.34, 0.55,
			0.49, 0.55,
			0.49, 0.43,

			//left column back
			0, 0,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			1, 1,

			//top rung back
			0, 0,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			1, 1,

			//middle rung back
			0, 0,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			1, 1,

			//top
			0, 0,
			1, 0,
			1, 1,
			0, 0,
			1, 1,
			0, 1,

			//top rung right
			0, 0,
			1, 0,
			1, 1,
			0, 0,
			1, 1,
			0, 1,

			//under top rung
			0, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 1,
			1, 0,

			//between top rung and middle
			0, 0,
			1, 1,
			0, 1,
			0, 0,
			1, 0,
			1, 1,

			//top of middle rung
			0, 0,
			1, 1,
			0, 1,
			0, 0,
			1, 0,
			1, 1,

			//right of middle rung
			0, 0,
			1, 1,
			0, 1,
			0, 0,
			1, 0,
			1, 1,

			//bottom of middle rung.
			0, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 1,
			1, 0,

			//right of bottom
			0, 0,
			1, 1,
			0, 1,
			0, 0,
			1, 0,
			1, 1,

			//bottom
			0, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 1,
			1, 0,

			//left side
			0, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 1,
			1, 0]), gl.STATIC_DRAW);

		//create a texture
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//fill the texture with a 1x1 blue pixel
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		//asynchronously load an image
		var image = new Image();
		image.src = "/img/f-texture.png";
		image.addEventListener('load', function() {
			//now that the image has loaded copy it to the texture
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		});

		//set up camera
		this.cameraPosition = [ 0, 50, 300 ];
		this.cameraHorizontalAngle = 0;
		this.cameraVerticalAngle = 0;
		mouse.onMouseEvent(function(type, x, y, dx, dy) {
			if(type === 'mousedown') {
				mouse.toggleLock();
			}
			this.cameraHorizontalAngle += dx / 100;
		}, this);

		//projection matrix
		this.projectionMatrix = null;
		this.recalculateProjectionMatrix();
	}
	Game.prototype.update = function(t) {
		// this.cameraHorizontalAngle += 2 * t;
	};
	Game.prototype.recalculateProjectionMatrix = function() {
		this.projectionMatrix = glMatrix.mat4.perspective([], 60 * Math.PI / 180,
			canvas.clientWidth / canvas.clientHeight, 1, 2000);
	};
	Game.prototype.render = function(gl, program) {
		//clear the canvas and depth buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//calculate the focal point
		var focalPoint = [ 200, 0, 0 ];

		//calculate the view matrix
		var viewMatrix = glMatrix.mat4.lookAt([], this.cameraPosition, focalPoint, UP);
		glMatrix.mat4.multiply(viewMatrix, this.projectionMatrix, viewMatrix);

		//set the view matrix and draw the geometry
		gl.uniformMatrix4fv(this.matrixLocation, false, viewMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
	};
	return Game;
});