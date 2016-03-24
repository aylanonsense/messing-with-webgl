define([], function() {
	return function createTextureCoordinate(frame, rows, cols) {
		var row = Math.floor(frame / rows);
		var col = frame % cols;
		var minX = col / cols, maxX = (col + 1) / cols;
		var minY = row / rows, maxY = (row + 1) / rows;
		return [
			minX, maxY,  maxX, maxY,  maxX, minY,
			maxX, minY,  minX, minY,  minX, maxY,
		];
	};
});