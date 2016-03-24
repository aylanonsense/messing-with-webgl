define([], function() {
	return function createTextureCoordinate(frame, width, height, rows, cols) {
		var row = Math.floor(frame / rows);
		var col = frame % cols;
		var minX = col / cols;// + 0.5 / width;
		var maxX = (col + 1) / cols;// - 0.5 / width;
		var minY = row / rows;// + 0.5 / height;
		var maxY = (row + 1) / rows;// - 0.5 / height;
		return [
			minX, maxY,  maxX, maxY,  maxX, minY,
			maxX, minY,  minX, minY,  minX, maxY,
		];
	};
});