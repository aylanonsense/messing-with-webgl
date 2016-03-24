define([
	'util/loadImage'
], function(
	loadImage
) {
	return function loadTexture(gl, textureConfigParams, callback) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//fill the texture with a 1x1 blue pixel
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		//asynchronously load texture image and mipmaps
		//TODO what about non-square textures?
		var imageFilePaths = [];
		for(var size = 1; size <= textureConfigParams.width; size *= 2) {
			imageFilePaths.push('/img/' + textureConfigParams.fileName + '-' + size + 'x' + size + '.png');
		}
		loadImage(imageFilePaths, function(images) {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			//configure all mip maps
			for(var i = 0; i < images.length; i++) {
				gl.texImage2D(gl.TEXTURE_2D, images.length - 1 - i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
			}
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

			//execute callback, just in case anyone cares that the texture is no longer a blue pixel
			if(callback) {
				callback(texture);
			}
		});
		return texture;
	};
});