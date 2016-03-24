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
					var v = noise.perlin3(x / 10, y / 10, z / 10);
					if(v > 0.1) {
						if(v > 0.3) {
							//stone
							blockData.push(3);
						}
						else {
							//grass
							blockData.push(2);
						}
					}
					else {
						//air
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