define([
	'canvas',
	'image/loadImage',
	'image/saveCanvas',
	'shared/display/textureConfig'
], function(
	Canvas,
	loadImage,
	saveCanvas,
	textureConfig
) {
	return function generateImages() {
		//generate quad texture and mip maps
		loadImage('raw/' + textureConfig.blocks.fileName + '.png', function(img) {
			var tileWidth = img.width / textureConfig.blocks.cols;
			var tileHeight = img.height / textureConfig.blocks.rows;
			var scale = 1;
			while(2 * img.width * scale >= 1 || 2 * img.height * scale >= 1) {
				var w = Math.max(1, 2 * img.width * scale), h = Math.max(1, 2 * img.height * scale);
				//create mip map
				var canvas = new Canvas(w, h);
				var ctx = canvas.getContext('2d');
				var tileWidth2 = w / (2 * textureConfig.blocks.cols);
				var tileHeight2 = h / (2 * textureConfig.blocks.rows);
				for(var c = 0; c < textureConfig.blocks.cols; c++) {
					for(var r = 0; r < textureConfig.blocks.rows; r++) {
						for(var c2 = 0; c2 < 2; c2++) {
							for(var r2 = 0; r2 < 2; r2++) {
								ctx.drawImage(img, c * tileWidth, r * tileHeight, tileWidth, tileHeight,
									(2 * c + c2) * tileWidth2, (2 * r + r2) * tileHeight2, tileWidth2, tileHeight2);
							}
						}
					}
				}
				//save mip map
				saveCanvas(canvas, 'generated/' + textureConfig.blocks.fileName + '-' + w + 'x' + h + '.png');
				scale /= 2;
			}
		});
	};
});