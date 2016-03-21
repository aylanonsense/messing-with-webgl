define([
	'gl-matrix'
], function(
	glMatrix
) {
	function Game(gl, program, canvas) {
		var buffer;

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
			0, 0, 0,
			0, 150, 0,
			30, 0, 0,
			0, 150, 0,
			30, 150, 0,
			30, 0, 0,

			//top rung front
			30, 0, 0,
			30, 30, 0,
			100, 0, 0,
			30, 30, 0,
			100, 30, 0,
			100, 0, 0,

			//middle rung front
			30, 60, 0,
			30, 90, 0,
			67, 60, 0,
			30, 90, 0,
			67, 90, 0,
			67, 60, 0,

			//left column back
				0, 0, 30,
			 30, 0, 30,
				0, 150, 30,
				0, 150, 30,
			 30, 0, 30,
			 30, 150, 30,

			//top rung back
			 30, 0, 30,
			100, 0, 30,
			 30, 30, 30,
			 30, 30, 30,
			100, 0, 30,
			100, 30, 30,

			//middle rung back
			 30, 60, 30,
			 67, 60, 30,
			 30, 90, 30,
			 30, 90, 30,
			 67, 60, 30,
			 67, 90, 30,

			//top
				0, 0, 0,
			100, 0, 0,
			100, 0, 30,
				0, 0, 0,
			100, 0, 30,
				0, 0, 30,

			//top rung right
			100, 0, 0,
			100, 30, 0,
			100, 30, 30,
			100, 0, 0,
			100, 30, 30,
			100, 0, 30,

			//under top rung
			30, 30, 0,
			30, 30, 30,
			100, 30, 30,
			30, 30, 0,
			100, 30, 30,
			100, 30, 0,

			//between top rung and middle
			30, 30, 0,
			30, 60, 30,
			30, 30, 30,
			30, 30, 0,
			30, 60, 0,
			30, 60, 30,

			//top of middle rung
			30, 60, 0,
			67, 60, 30,
			30, 60, 30,
			30, 60, 0,
			67, 60, 0,
			67, 60, 30,

			//right of middle rung
			67, 60, 0,
			67, 90, 30,
			67, 60, 30,
			67, 60, 0,
			67, 90, 0,
			67, 90, 30,

			//bottom of middle rung
			30, 90, 0,
			30, 90, 30,
			67, 90, 30,
			30, 90, 0,
			67, 90, 30,
			67, 90, 0,

			//right of bottom
			30, 90, 0,
			30, 150, 30,
			30, 90, 30,
			30, 90, 0,
			30, 150, 0,
			30, 150, 30,

			//bottom
			0, 150, 0,
			0, 150, 30,
			30, 150, 30,
			0, 150, 0,
			30, 150, 30,
			30, 150, 0,

			//left side
			0, 0, 0,
			0, 0, 30,
			0, 150, 30,
			0, 0, 0,
			0, 150, 30,
			0, 150, 0
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
		this.cameraAngleRadians = 0 * Math.PI / 180;
		this.fieldOfViewRadians = 60 * Math.PI / 180;
	}
	Game.prototype.update = function(t) {
		this.cameraAngleRadians += 2 * t;
	};
	Game.prototype.render = function(gl, program, canvas) {
		var numFs = 5;
		var radius = 200;

		//clear the canvas AND the depth buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//compute the projection matrix
		var aspect = canvas.clientWidth / canvas.clientHeight;
		var projectionMatrix = glMatrix.mat4.perspective([], this.fieldOfViewRadians, aspect, 1, 2000);

		//Compute the position of the first F
		var fPosition = [radius, 0, 0];

		//Use matrix math to compute a position on the circle
		var cameraMatrix = glMatrix.mat4.translate([], glMatrix.mat4.identity([]), [ 0, 50, radius * 1.5 ]);
		var rotationMatrix = glMatrix.mat4.rotateY([], glMatrix.mat4.identity([]), this.cameraAngleRadians);
		glMatrix.mat4.multiply(cameraMatrix, rotationMatrix, cameraMatrix);


		//Get the camera's postion from the matrix we computed
		cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ];
		// console.log(cameraPosition); /

		var up = [0, 1, 0];

		//Compute the camera's matrix using look at
		var viewMatrix = glMatrix.mat4.lookAt([], cameraPosition, fPosition, up);

		//draw 'F's in a circle
		for(var i = 0; i < numFs; ++i) {
			var angle = i * Math.PI * 2 / numFs;

			var x = Math.cos(angle) * radius;
			var z = Math.sin(angle) * radius;
			var translationMatrix = glMatrix.mat4.translate([], glMatrix.mat4.identity([]), [ x, 0, z ]);

			//multiply the matrices
			var matrix = translationMatrix;
			glMatrix.mat4.multiply(matrix, viewMatrix, matrix);
			glMatrix.mat4.multiply(matrix, projectionMatrix, matrix);

			//set the matrix
			gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

			//draw the geometry
			gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
		}
	};
	return Game;
});