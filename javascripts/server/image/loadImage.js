define([
	'fs',
	'path',
	'module',
	'canvas'
], function(
	fs,
	path,
	module,
	Canvas
) {
	var __filename = module.uri;
	var __dirname = path.dirname(__filename);

	return function loadImage(fileName, callback) {
		fs.readFile(__dirname + '/../../../img/' + fileName, function(err, imageData) {
			if(err) {
				throw err;
			}
			else {
				var img = new Canvas.Image();
				img.src = imageData;
				callback(img);
			}
		});
	};
});