define([
	'fs',
	'path',
	'module',
	'canvas',
	'image/loadImage'
], function(
	fs,
	path,
	module,
	Canvas,
	loadImage
) {
	var __filename = module.uri;
	var __dirname = path.dirname(__filename);

	return function saveCanvas(canvas, fileName, callback) {
		var out = fs.createWriteStream(__dirname + '/../../../img/' + fileName);
		var stream = canvas.pngStream();
		stream.on('data', function(chunk) {
			out.write(chunk);
		});
		stream.on('end', function() {
			if(callback) {
				callback();
			}
		});
	};
});