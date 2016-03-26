define([
	'shared/block/blockTypes',
	'shared/display/textureConfig',
	'display/createTextureCoordinates'
], function(
	blockTypes,
	textureConfig,
	createTextureCoordinates
) {
	var DIRECTIONS = [ 'top', 'bottom', 'front', 'back', 'left', 'right' ];

	var efficientBlockTypes = {};
	for(var type in blockTypes) {
		var obj = { texture: { coordinates: {}, sizes: {}, offsets: {} } };

		//figure out the texture coordinates for each face of each type of block
		for(var i = 0; i < DIRECTIONS.length; i++) {
			var frame = blockTypes[type].texture[DIRECTIONS[i]];
			var texture = createTextureCoordinates(frame,
				textureConfig.blocks.width, textureConfig.blocks.height,
				textureConfig.blocks.rows, textureConfig.blocks.cols);
			obj.texture.coordinates[DIRECTIONS[i]] = texture.coordinates;
			obj.texture.sizes[DIRECTIONS[i]] = texture.sizes;
			obj.texture.offsets[DIRECTIONS[i]] = texture.offsets;
		}
		efficientBlockTypes[type] = obj;
	}
	return efficientBlockTypes;
});