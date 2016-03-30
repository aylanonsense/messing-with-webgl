define([
	'shared/config',
	'geom/createCubeGeometry',
	'shared/block/blockTypesEnum',
	'block/efficientBlockTypes'
], function(
	sharedConfig,
	createCubeGeometry,
	blockTypesEnum,
	efficientBlockTypes
) {
	var BLOCK_NORMALS = [
		//front
		0, 0, 1,  0, 0, 1,  0, 0, 1,
		0, 0, 1,  0, 0, 1,  0, 0, 1,

		//back
		0, 0, -1,  0, 0, -1,  0, 0, -1,
		0, 0, -1,  0, 0, -1,  0, 0, -1,

		//left
		1, 0, 0,  1, 0, 0,  1, 0, 0,
		1, 0, 0,  1, 0, 0,  1, 0, 0,

		//right
		-1, 0, 0,  -1, 0, 0,  -1, 0, 0,
		-1, 0, 0,  -1, 0, 0,  -1, 0, 0,

		//top
		0, 1, 0,  0, 1, 0,  0, 1, 0,
		0, 1, 0,  0, 1, 0,  0, 1, 0,			

		//bottom
		0, -1, 0,  0, -1, 0,  0, -1, 0,
		0, -1, 0 , 0, -1, 0,  0, -1, 0
	];

	function Chunk(params) {
		//variables solely to make initialization easier
		this.blockTypes = params.blockTypes;
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.z = params.z || 0;
		this.width = sharedConfig.CHUNK_WIDTH * sharedConfig.BLOCK_SIZE;
		this.height = sharedConfig.CHUNK_HEIGHT * sharedConfig.BLOCK_SIZE;
		this.depth = sharedConfig.CHUNK_DEPTH * sharedConfig.BLOCK_SIZE;

		//initialize geometry
		this.vertices = [];
		this.normals = [];
		this.textureCoordinates = [];
		this.textureSizes = [];
		this.textureOffsets = [];
		this._createSimpleBlockGeometry();
	}
	/*Chunk.prototype._createSimpleChunkGeometry = function() {
		//just one big cube around the whole chunk, ignoring blocks
		var geom = createCubeGeometry(this.x, this.y, this.z, this.width, this.height, this.depth);
		this.vertices = geom.vertices;
		this.textureCoordinates = geom.textureCoordinates;
	};*/
	Chunk.prototype._createSimpleBlockGeometry = function() {
		for(var x = 0; x < sharedConfig.CHUNK_WIDTH; x++) {
			for(var y = 0; y < sharedConfig.CHUNK_HEIGHT; y++) {
				for(var z = 0; z < sharedConfig.CHUNK_DEPTH; z++) {
					var i = x * sharedConfig.CHUNK_HEIGHT * sharedConfig.CHUNK_DEPTH + y * sharedConfig.CHUNK_DEPTH + z;
					if(blockTypesEnum[this.blockTypes[i]]) {
						var blockType = blockTypesEnum[this.blockTypes[i]];
						var texture = efficientBlockTypes[blockType].texture;

						//create vertices for each block
						this.vertices.push.apply(this.vertices, createCubeGeometry(
							this.x * sharedConfig.CHUNK_WIDTH * sharedConfig.BLOCK_SIZE + x * sharedConfig.BLOCK_SIZE,
							this.y * sharedConfig.CHUNK_HEIGHT * sharedConfig.BLOCK_SIZE + y * sharedConfig.BLOCK_SIZE,
							this.z * sharedConfig.CHUNK_DEPTH * sharedConfig.BLOCK_SIZE + z * sharedConfig.BLOCK_SIZE,
							sharedConfig.BLOCK_SIZE, sharedConfig.BLOCK_SIZE, sharedConfig.BLOCK_SIZE));

						//add normal vectors for each triangle
						this.normals.push.apply(this.normals, BLOCK_NORMALS);

						//create texture coordinates for each block
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.front);
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.back);
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.left);
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.right);
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.top);
						this.textureCoordinates.push.apply(this.textureCoordinates, texture.coordinates.bottom);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.front);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.back);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.left);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.right);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.top);
						this.textureSizes.push.apply(this.textureSizes, texture.sizes.bottom);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.front);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.back);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.left);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.right);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.top);
						this.textureOffsets.push.apply(this.textureOffsets, texture.offsets.bottom);
					}
				}
			}
		}
	};
	return Chunk;
});