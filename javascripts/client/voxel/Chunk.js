define([
	'shared/config',
	'geom/createCubeGeometry',
	'shared/block/blockTypesEnum',
	'block/efficientBlockTypes'
], function(
	config,
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
		this.blockData = params.blockData;
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.z = params.z || 0;
		this.width = config.CHUNK_WIDTH * config.BLOCK_WIDTH;
		this.height = config.CHUNK_HEIGHT * config.BLOCK_HEIGHT;
		this.depth = config.CHUNK_DEPTH * config.BLOCK_DEPTH;

		//initialize geometry
		this.vertices = [];
		this.normals = [];
		this.textureCoordinates = [];
		this._createSimpleBlockGeometry();
	}
	/*Chunk.prototype._createSimpleChunkGeometry = function() {
		//just one big cube around the whole chunk, ignoring blocks
		var geom = createCubeGeometry(this.x, this.y, this.z, this.width, this.height, this.depth);
		this.vertices = geom.vertices;
		this.textureCoordinates = geom.textureCoordinates;
	};*/
	Chunk.prototype._createSimpleBlockGeometry = function() {
		for(var x = 0; x < config.CHUNK_WIDTH; x++) {
			for(var y = 0; y < config.CHUNK_HEIGHT; y++) {
				for(var z = 0; z < config.CHUNK_DEPTH; z++) {
					var i = x * config.CHUNK_HEIGHT * config.CHUNK_DEPTH + y * config.CHUNK_DEPTH + z;
					if(blockTypesEnum[this.blockData[i]]) {
						var blockType = blockTypesEnum[this.blockData[i]];
						var textureCoordinates = efficientBlockTypes[blockType].textureCoordinates;

						//create vertices for each block
						this.vertices.push.apply(this.vertices, createCubeGeometry(
							this.x + x * config.BLOCK_WIDTH,
							this.y + y * config.BLOCK_HEIGHT,
							this.z + z * config.BLOCK_DEPTH,
							config.BLOCK_WIDTH, config.BLOCK_HEIGHT, config.BLOCK_DEPTH));

						//add normal vectors for each triangle
						this.normals.push.apply(this.normals, BLOCK_NORMALS);

						//create texture coordinates for each block
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.front);
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.back);
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.left);
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.right);
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.top);
						this.textureCoordinates.push.apply(this.textureCoordinates, textureCoordinates.bottom);
					}
				}
			}
		}
	};
	return Chunk;
});