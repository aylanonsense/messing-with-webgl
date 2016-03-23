define([
	'shared/config',
	'geom/createBlockGeometry',
	'noisejs',
], function(
	config,
	createBlockGeometry,
	noisejs
) {
	// value passed into the constructor is used as a seed
	var noise = new noisejs(Math.random());//0.63478145);

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
		this.textureCoordinates = [];
		this._createSimpleBlockGeometry();
	}
	Chunk.prototype._createSimpleChunkGeometry = function() {
		//just one big cube around the whole chunk, ignoring blocks
		var geom = createBlockGeometry(this.x, this.y, this.z, this.width, this.height, this.depth);
		this.vertices = geom.vertices;
		this.textureCoordinates = geom.textureCoordinates;
	};
	Chunk.prototype._createSimpleBlockGeometry = function() {
		for(var x = 0; x < config.CHUNK_WIDTH; x++) {
			for(var y = 0; y < config.CHUNK_HEIGHT; y++) {
				for(var z = 0; z < config.CHUNK_DEPTH; z++) {
					var i = x * config.CHUNK_HEIGHT * config.CHUNK_DEPTH + y * config.CHUNK_DEPTH + z;
					if(this.blockData[i]) {
						var geom = createBlockGeometry(
							this.x + x * config.BLOCK_WIDTH,
							this.y + y * config.BLOCK_HEIGHT,
							this.z + z * config.BLOCK_DEPTH,
							config.BLOCK_WIDTH, config.BLOCK_HEIGHT, config.BLOCK_DEPTH);
						this.vertices.push.apply(this.vertices, geom.vertices);
						this.textureCoordinates.push.apply(this.textureCoordinates, geom.textureCoordinates);
					}
				}
			}
		}
	};
	return Chunk;
});