define([], function() {
	return function createTextureCoordinate(frame, width, height, rows, cols) {
		var row = Math.floor(frame / rows);
		var col = frame % cols;
		var tileWidth = 1 / cols;
		var tileHeight = 1 / rows;
		var minX = col / cols;// + 0.5 / width;
		var maxX = minX + tileWidth;// - 0.5 / width;
		var minY = row / rows;// + 0.5 / height;
		var maxY = minY + tileHeight;// - 0.5 / height;
		minX -= 0.003 / width; //necessary to avoid small texture misalignment ~shrug~
		minY -= 0.003 / height;
		return {
			coordinates: [
				minX, maxY,  maxX, maxY,  maxX, minY,
				maxX, minY,  minX, minY,  minX, maxY,
			],
			offsets: [
				minX, minY,  minX, minY,  minX, minY,
				minX, minY,  minX, minY,  minX, minY
			],
			sizes: [
				tileWidth, tileHeight,  tileWidth, tileHeight,  tileWidth, tileHeight,
				tileWidth, tileHeight,  tileWidth, tileHeight,  tileWidth, tileHeight
			]
		};
	};
});