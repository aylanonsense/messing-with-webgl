define(function() {
	return function loadImage(imagePath, callback) {
		var numImagesLoaded, images;
		function loadIndividualImageWrapped(imagePath2, i) {
			loadIndividualImage(imagePath2, function(image) {
				images[i] = image;
				numImagesLoaded++;
				if(numImagesLoaded === imagePath.length) {
					callback(images);
				}
			});
		}
		if(imagePath instanceof Array) {
			numImagesLoaded = 0;
			images = [];
			for(var i = 0; i < imagePath.length; i++) {
				loadIndividualImageWrapped(imagePath[i], i);
			}
			return images;
		}
		else {
			loadIndividualImage(imagePath, callback);
		}
	};

	function loadIndividualImage(imagePath, callback) {
		var image = new Image();
		image.src = imagePath;
		image.addEventListener('load', function() {
			callback(image);
		});
	}
});