define([
	'shared/config',
	'noisejs'
], function(
	config,
	noisejs
) {
	function generateBlock(x, y, z, noise) {
		var v = noise.perlin3(x / 10, y / 10, z / 10);
		if(v > 0.1) {
			if(v > 0.3) {
				return 3; //stone
			}
			else {
				return 2; //grass
			}
		}
		else {
			return 0; //air
		}
	}

	return function generateChunk(chunkX, chunkY, chunkZ, seed) {
		var noise = new noisejs(seed);
		var blockTypes = [];
		for(var x = 0; x < config.CHUNK_WIDTH; x++) {
			for(var y = 0; y < config.CHUNK_HEIGHT; y++) {
				for(var z = 0; z < config.CHUNK_DEPTH; z++) {
					blockTypes.push(generateBlock(
						chunkX * config.CHUNK_WIDTH + x,
						chunkY * config.CHUNK_HEIGHT + y,
						chunkZ * config.CHUNK_DEPTH + z, noise));
				}
			}
		}
		return { x: chunkX, y: chunkY, z: chunkZ, blockTypes: blockTypes };
	};
});