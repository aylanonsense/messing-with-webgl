define(function() {
	return function createCubeGeometry(x, y, z, width, height, depth) {
		var xMin = x, xMax = x + width;
		var yMin = y, yMax = y + height;
		var zMin = z, zMax = z + depth;
		return [
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
	};
});