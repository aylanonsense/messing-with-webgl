define([
	'shared/config',
	'noisejs'
], function(
	sharedConfig,
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
		for(var x = 0; x < sharedConfig.CHUNK_WIDTH; x++) {
			for(var y = 0; y < sharedConfig.CHUNK_HEIGHT; y++) {
				for(var z = 0; z < sharedConfig.CHUNK_DEPTH; z++) {
					blockTypes.push(generateBlock(
						chunkX * sharedConfig.CHUNK_WIDTH + x,
						chunkY * sharedConfig.CHUNK_HEIGHT + y,
						chunkZ * sharedConfig.CHUNK_DEPTH + z, noise));
				}
			}
		}
		return { x: chunkX, y: chunkY, z: chunkZ, blockTypes: blockTypes };
	};
});