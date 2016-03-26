define([
	'shared/config',
	'global',
	'display/canvas',
	'shared/display/textureConfig',
	'display/loadTexture',
	'gl-matrix',
	'voxel/ChunkManager',
	'voxel/Chunk',
	'input/mouse',
	'input/keyboard',
	'terrain/loadChunks'
], function(
	config,
	global,
	canvas,
	textureConfig,
	loadTexture,
	glMatrix,
	ChunkManager,
	Chunk,
	mouse,
	keyboard,
	loadChunks
) {
	function Game(gl, program) {
		var buffer;

		this.chunkManager = new ChunkManager();
		this.numTriangles = 0;

		//configure WebGL
		gl.useProgram(program);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		//look up shader variables
		var positionLocation = gl.getAttribLocation(program, 'a_position');
		var normalLocation = gl.getAttribLocation(program, 'a_normal');
		var textureCoordinateLocation = gl.getAttribLocation(program, 'a_texturecoordinate');
		var textureSizeLocation = gl.getAttribLocation(program, 'a_texturesize');
		var textureOffsetLocation = gl.getAttribLocation(program, 'a_textureoffset');
		this.matrixLocation = gl.getUniformLocation(program, 'u_matrix');

		//create a buffer for vertices
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a buffer for normals
		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.enableVertexAttribArray(normalLocation);
		gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a buffer for texture coordinates
		this.textureCoordinateBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
		gl.enableVertexAttribArray(textureCoordinateLocation);
		gl.vertexAttribPointer(textureCoordinateLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a buffer for texture sizes
		this.textureSizeBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureSizeBuffer);
		gl.enableVertexAttribArray(textureSizeLocation);
		gl.vertexAttribPointer(textureSizeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a buffer for texture offsets
		this.textureOffsetBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureOffsetBuffer);
		gl.enableVertexAttribArray(textureOffsetLocation);
		gl.vertexAttribPointer(textureOffsetLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);

		//create a texture
		var blockTexture = loadTexture(gl, textureConfig.blocks);
		gl.bindTexture(gl.TEXTURE_2D, blockTexture);

		//set up camera
		this.cameraPosition = [
			2.1 * config.CHUNK_WIDTH * config.BLOCK_SIZE,
			1.05 * config.CHUNK_HEIGHT * config.BLOCK_SIZE,
			2.1 * config.CHUNK_DEPTH * config.BLOCK_SIZE
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
		loadChunks('test-level', function(chunks) {
			for(var i = 0; i < chunks.length; i++) {
				this.chunkManager.addChunk(chunks[i].x, chunks[i].y, chunks[i].z, chunks[i].blockTypes);
			}
			this.rebuildGeometry(gl, program);
		}, this);
	}
	Game.prototype.rebuildGeometry = function(gl, program) {
		//compile vertices and texture coordinates
		var vertices = [];
		var normals = [];
		var textureCoordinates = [];
		var textureSizes = [];
		var textureOffsets = [];
		for(var i = 0; i < this.chunkManager.chunks.length; i++) {
			vertices = vertices.concat(this.chunkManager.chunks[i].vertices);
			normals = normals.concat(this.chunkManager.chunks[i].normals);
			textureCoordinates = textureCoordinates.concat(this.chunkManager.chunks[i].textureCoordinates);
			textureSizes = textureSizes.concat(this.chunkManager.chunks[i].textureSizes);
			textureOffsets = textureOffsets.concat(this.chunkManager.chunks[i].textureOffsets);
		}
		this.numTriangles = vertices.length / 3;

		//fill the vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		//fill the normal buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

		//fill the text coordinate buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureSizeBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureSizes), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureOffsetBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureOffsets), gl.STATIC_DRAW);
	};
	Game.prototype.update = function(t) {
		if(mouse.isLocked()) {
			var keys = keyboard.getState();
			var moveSpeed = keys.SPRINT ? 500 : 100;
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