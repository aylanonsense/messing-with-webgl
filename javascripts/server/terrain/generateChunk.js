define([
	'shared/config',
	'noisejs'
], function(
	config,
	noisejs
) {
	function generateBlock(x, y, z, noise) {
		var h = 5 * noise.perlin3(x / 15, 0, z / 15) + 7;
		if(h > 3 + y) {
			return 3; //stone
		}
		else if(h > y) {
			return 2; //grass
		}
		else {
			return null;
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