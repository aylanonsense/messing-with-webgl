define([
	'shared/config',
	'noisejs'
], function(
	config,
	noisejs
) {
	return function generateTerrain(params) {
		var noise = new noisejs(params.seed);
		var blockData = [];
		for(var x = 0; x < params.width; x++) {
			for(var y = 0; y < params.height; y++) {
				for(var z = 0; z < params.depth; z++) {
					if(noise.perlin3(x / 10, y / 10, z / 10) > 0.1) {
						blockData.push(1);
					}
					else {
						blockData.push(0);
					}
				}
			}
		}
		return {
			width: params.width,
			height: params.height,
			depth: params.depth,
			blocks: blockData
		};
	};
});