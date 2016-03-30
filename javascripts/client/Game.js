define([
	'shared/config',
	'display/canvas',
	'shared/display/textureConfig',
	'display/loadTexture',
	'gl-matrix',
	'entity/Player',
	'voxel/ChunkManager',
	'voxel/Chunk',
	'terrain/loadChunks'
], function(
	sharedConfig,
	canvas,
	textureConfig,
	loadTexture,
	glMatrix,
	Player,
	ChunkManager,
	Chunk,
	loadChunks
) {
	function Game(gl, program) {
		var buffer;

		this.chunkManager = new ChunkManager();
		this.player = new Player({ x: 0, y: sharedConfig.CHUNK_HEIGHT * sharedConfig.BLOCK_SIZE, z: 0,
			horizontalDir: 0, verticalDir: 0 });
		this.entities = [ this.player ];
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

		//projection matrix
		this.projectionMatrix = null;
		this.recalculateProjectionMatrix();

		//rebuild geometry (even though there is none until the terrain loads)
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
		for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].update(t);
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
		glMatrix.mat4.rotateY(cameraRotation, cameraRotation, this.player.horizontalDir);
		glMatrix.mat4.rotateX(cameraRotation, cameraRotation, this.player.verticalDir);
		glMatrix.vec3.transformMat4(focalPoint, focalPoint, cameraRotation);
		glMatrix.vec3.add(focalPoint, focalPoint, this.player.pos);

		//calculate the view matrix
		var viewMatrix = glMatrix.mat4.lookAt([], this.player.pos, focalPoint, [ 0, 1, 0 ]);
		glMatrix.mat4.multiply(viewMatrix, this.projectionMatrix, viewMatrix);

		//set the view matrix and draw the geometry
		gl.uniformMatrix4fv(this.matrixLocation, false, viewMatrix);
		if(this.numTriangles > 0) {
			gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
		}
	};
	return Game;
});