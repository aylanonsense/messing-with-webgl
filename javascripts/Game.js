define([
	'display/canvas',
	'gl-matrix',
	'entities/Cube',
	'input/mouse',
	'input/keyboard'
], function(
	canvas,
	glMatrix,
	Cube,
	mouse,
	keyboard
) {
	function Game(gl, program) {
		var buffer;
		var cube = new Cube();

		//configure WebGL
		gl.useProgram(program);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		//look up shader variables
		var positionLocation = gl.getAttribLocation(program, "a_position");
		var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.matrixLocation = gl.getUniformLocation(program, "u_matrix");

		//create a buffer for vertices
		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		var positions = new Float32Array(cube.vertices);
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
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.textureCoordinates), gl.STATIC_DRAW);

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
		this.cameraPosition = [ 0, 0, 0 ];
		this.cameraHorizontalAngle = Math.PI / 2;
		this.cameraVerticalAngle = 0;
		mouse.onMouseEvent(function(type, x, y, dx, dy) {
			if(type === 'mousedown') {
				mouse.toggleLock();
			}
			if(mouse.isLocked()) {
				this.cameraVerticalAngle = Math.min(Math.max(-Math.PI / 2 + 0.05,
					this.cameraVerticalAngle + dy / 200), Math.PI / 2 - 0.05);
				this.cameraHorizontalAngle -= dx / 150;
			}
		}, this);

		//projection matrix
		this.projectionMatrix = null;
		this.recalculateProjectionMatrix();
	}
	Game.prototype.update = function(t) {
		if(mouse.isLocked()) {
			var keys = keyboard.getState();
			var cosAngle = Math.cos(this.cameraHorizontalAngle);
			var sinAngle = Math.sin(this.cameraHorizontalAngle);
			if(keys.UP !== keys.DOWN) {
				this.cameraPosition[0] += sinAngle * 200 * t * (keys.UP ? 1 : -1);
				this.cameraPosition[2] += cosAngle * 200 * t * (keys.UP ? 1 : -1);
			}
			if(keys.LEFT !== keys.RIGHT) {
				this.cameraPosition[0] += cosAngle * 200 * t * (keys.LEFT ? 1 : -1);
				this.cameraPosition[2] -= sinAngle * 200 * t * (keys.LEFT ? 1 : -1);
			}
			if(keys.JUMP !== keys.CROUCH) {
				this.cameraPosition[1] += 200 * t * (keys.JUMP ? 1 : -1);
			}
		}
	};
	Game.prototype.recalculateProjectionMatrix = function() {
		this.projectionMatrix = glMatrix.mat4.perspective([], 60 * Math.PI / 180,
			canvas.clientWidth / canvas.clientHeight, 1, 2000);
	};
	Game.prototype.render = function(gl, program) {
		//clear the canvas and depth buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//calculate the focal point
		var focalPoint = [ 0, 0, 1 ];
		var cameraRotation = glMatrix.mat4.identity([]);
		glMatrix.mat4.rotateY(cameraRotation, cameraRotation, this.cameraHorizontalAngle);
		glMatrix.mat4.rotateX(cameraRotation, cameraRotation, this.cameraVerticalAngle);
		glMatrix.vec3.transformMat4(focalPoint, focalPoint, cameraRotation);
		glMatrix.vec3.add(focalPoint, focalPoint, this.cameraPosition);

		//calculate the view matrix
		var viewMatrix = glMatrix.mat4.lookAt([], this.cameraPosition, focalPoint, [ 0, 1, 0 ]);
		glMatrix.mat4.multiply(viewMatrix, this.projectionMatrix, viewMatrix);

		//set the view matrix and draw the geometry
		gl.uniformMatrix4fv(this.matrixLocation, false, viewMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
	};
	return Game;
});