define([
	'shared/block/blockTypes',
	'display/textureConfig',
	'display/createTextureCoordinates'
], function(
	blockTypes,
	textureConfig,
	createTextureCoordinates
) {
	var DIRECTIONS = [ 'top', 'bottom', 'front', 'back', 'left', 'right' ];

	var efficientBlockTypes = {};
	for(var type in blockTypes) {
		var obj = { textureCoordinates: {} };

		//figure out the texture coordinates for each face of each type of block
		for(var i = 0; i < DIRECTIONS.length; i++) {
			var frame = blockTypes[type].texture[DIRECTIONS[i]];
			var textureCoordinates = createTextureCoordinates(frame,
				textureConfig.blocks.rows, textureConfig.blocks.cols);
			obj.textureCoordinates[DIRECTIONS[i]] = textureCoordinates;
		}
		efficientBlockTypes[type] = obj;
	}
	return efficientBlockTypes;
});