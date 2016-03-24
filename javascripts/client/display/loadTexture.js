define([], function() {
	return function loadTexture(gl, fileName, callback) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//fill the texture with a 1x1 blue pixel
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		//asynchronously load an image
		var image = new Image();
		image.src = '/img/' + fileName;
		image.addEventListener('load', function() {
			//now that the image has loaded copy it to the texture
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			if(callback) {
				callback(texture);
			}
		});
		return texture;
	};
});