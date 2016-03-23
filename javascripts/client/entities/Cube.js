define([
	'shared/config'
], function(
	config
) {
	function Cube(params) {
		var x = params.x || 0, y = params.y || 0, z = params.z || 0;
		var xMin = x + 0, xMax = x + config.CHUNK_WIDTH * config.BLOCK_WIDTH;
		var yMin = y + 0, yMax = y + config.CHUNK_HEIGHT * config.BLOCK_HEIGHT;
		var zMin = z + 0, zMax = z + config.CHUNK_DEPTH * config.BLOCK_DEPTH;
		this.vertices = [
			//front
			xMin, yMin, zMax,  xMax, yMin, zMax,  xMax, yMax, zMax,
			xMax, yMax, zMax,  xMin, yMax, zMax,  xMin, yMin, zMax,

			//back
			xMax, yMin, zMin,  xMin, yMin, zMin,  xMin, yMax, zMin,
			xMin, yMax, zMin,  xMax, yMax, zMin,  xMax, yMin, zMin,

			//left
			xMax, yMin, zMax,  xMax, yMin, zMin,  xMax, yMax, zMin,
			xMax, yMax, zMin,  xMax, yMax, zMax,  xMax, yMin, zMax,

			//right
			xMin, yMin, zMin,  xMin, yMin, zMax,  xMin, yMax, zMax,
			xMin, yMax, zMax,  xMin, yMax, zMin,  xMin, yMin, zMin,

			//top
			xMin, yMax, zMax,  xMax, yMax, zMax,  xMax, yMax, zMin,
			xMax, yMax, zMin,  xMin, yMax, zMin,  xMin, yMax, zMax,

			//bottom
			xMin, yMin, zMin,  xMax, yMin, zMin,  xMax, yMin, zMax,
			xMax, yMin, zMax,  xMin, yMin, zMax,  xMin, yMin, zMin,
		];
		this.textureCoordinates = [
			//front
			0.25, 1.00,  0.50, 1.00,  0.50, 0.50, //0, 1,  1, 1,  1, 0,
			0.50, 0.50,  0.25, 0.50,  0.25, 1.00, //1, 0,  0, 0,  0, 1,

			//back
			0.50, 1.00,  0.75, 1.00,  0.75, 0.50, //0, 1,  1, 1,  1, 0,
			0.75, 0.50,  0.50, 0.50,  0.50, 1.00, //1, 0,  0, 0,  0, 1,

			//left
			0.25, 0.50,  0.50, 0.50,  0.50, 0.00, //0, 1,  1, 1,  1, 0,
			0.50, 0.00,  0.25, 0.00,  0.25, 0.50, //1, 0,  0, 0,  0, 1,

			//right
			0.50, 0.50,  0.75, 0.50,  0.75, 0.00, //0, 1,  1, 1,  1, 0,
			0.75, 0.00,  0.50, 0.00,  0.50, 0.50, //1, 0,  0, 0,  0, 1,

			//top
			0.00, 0.50,  0.25, 0.50,  0.25, 0.00, //0, 1,  1, 1,  1, 0,
			0.25, 0.00,  0.00, 0.00,  0.00, 0.50, //1, 0,  0, 0,  0, 1,

			//bottom
			0.00, 1.00,  0.25, 1.00,  0.25, 0.50, //0, 1,  1, 1,  1, 0,
			0.25, 0.50,  0.00, 0.50,  0.00, 1.00, //1, 0,  0, 0,  0, 1,
		];
	}
	return Cube;
});