define([
	'shared/config',
	'global',
	'display/canvas',
	'gl-matrix',
	'entities/Chunk',
	'input/mouse',
	'input/keyboard',
	'terrain/loadTerrain'
], function(
	config,
	global,
	canvas,
	glMatrix,
	Chunk,
	mouse,
	keyboard,
	loadTerrain
) {
	function Game(gl, program) {
		var buffer;

		this.chunks = [];
		this.numTriangles = 0;

		//configure WebGL
		gl.useProgram(program);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		//look up shader variables
		var positionLocation = gl.getAttribLocation(program, "a_position");
		var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.matrixLocation = gl.getUniformLocation(program, "u_matrix");

		//create a buffer for vertices
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a buffer for texcoords
		this.textCoordinateBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordinateBuffer);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a texture
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//fill the texture with a 1x1 blue pixel
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		//asynchronously load an image
		var image = new Image();
		image.src = "/img/debug-block-texture.png";
		image.addEventListener('load', function() {
			//now that the image has loaded copy it to the texture
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		});

		//set up camera
		this.cameraPosition = [
			7 * config.CHUNK_WIDTH * config.BLOCK_WIDTH,
			2.5 * config.CHUNK_HEIGHT * config.BLOCK_HEIGHT,
			7 * config.CHUNK_DEPTH * config.BLOCK_DEPTH
		];
		this.cameraHorizontalAngle = Math.PI * -3 / 4;
		this.cameraVerticalAngle = Math.PI / 8;
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

		//rebuild geometry (even though there is none)
		this.rebuildGeometry(gl, program);

		//load terrain
		loadTerrain('test-level', function(terrain) {
			this.applyTerrain(terrain);
			this.rebuildGeometry(gl, program);
		}, this);
	}
	Game.prototype.applyTerrain = function(terrain) {
		this.chunks = [];
		for(var chunkX = 0; chunkX < terrain.width; chunkX += config.CHUNK_WIDTH) {
			for(var chunkY = 0; chunkY < terrain.height; chunkY += config.CHUNK_HEIGHT) {
				for(var chunkZ = 0; chunkZ < terrain.depth; chunkZ += config.CHUNK_DEPTH) {
					//collect the blockData for this chunk
					var blockData = [];
					for(var x = 0; x < config.CHUNK_WIDTH; x++) {
						for(var y = 0; y < config.CHUNK_HEIGHT; y++) {
							for(var z = 0; z < config.CHUNK_DEPTH; z ++) {
								if(chunkX + x < terrain.width && chunkY + y < terrain.height && chunkZ + z < terrain.depth) {
									//figure out if there is even a block in that position
									var i = (chunkX + x) + terrain.width * (chunkY + y) +
										terrain.width * terrain.height * (chunkZ + z);
									blockData.push(terrain.blocks[i] ? 1 : 0);
								}
								else {
									blockData.push(0);
								}
							}
						}
					}
					this.chunks.push(new Chunk({
						blockData: blockData,
						x: chunkX * config.BLOCK_WIDTH,
						y: chunkY * config.BLOCK_HEIGHT,
						z: chunkZ * config.BLOCK_DEPTH
					}));
				}
			}
		}
	};
	Game.prototype.rebuildGeometry = function(gl, program) {
		//compile vertices and texture coordinates
		var vertices = [];
		var textureCoordinates = [];
		for(var i = 0; i < this.chunks.length; i++) {
			vertices = vertices.concat(this.chunks[i].vertices);
			textureCoordinates = textureCoordinates.concat(this.chunks[i].textureCoordinates);
		}
		this.numTriangles = vertices.length / 3;

		//create a buffer for vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		//create a buffer for texcoords
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordinateBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
	};
	Game.prototype.update = function(t) {
		if(mouse.isLocked()) {
			var keys = keyboard.getState();
			var moveSpeed = keys.SPRINT ? 1500 : 250;
			var cosAngle = Math.cos(this.cameraHorizontalAngle);
			var sinAngle = Math.sin(this.cameraHorizontalAngle);
			if(keys.UP !== keys.DOWN) {
				this.cameraPosition[0] += sinAngle * moveSpeed * t * (keys.UP ? 1 : -1);
				this.cameraPosition[2] += cosAngle * moveSpeed * t * (keys.UP ? 1 : -1);
			}
			if(keys.LEFT !== keys.RIGHT) {
				this.cameraPosition[0] += cosAngle * moveSpeed * t * (keys.LEFT ? 1 : -1);
				this.cameraPosition[2] -= sinAngle * moveSpeed * t * (keys.LEFT ? 1 : -1);
			}
			if(keys.JUMP !== keys.CROUCH) {
				this.cameraPosition[1] += moveSpeed * t * (keys.JUMP ? 1 : -1);
			}
		}
	};
	Game.prototype.recalculateProjectionMatrix = function() {
		this.projectionMatrix = glMatrix.mat4.perspective([], 60 * Math.PI / 180,
			canvas.clientWidth / canvas.clientHeight, 1, 20000);
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
		if(this.numTriangles > 0) {
			gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
		}
	};
	return Game;
});