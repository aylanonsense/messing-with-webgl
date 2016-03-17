define([
	'util/loadFile',
	'webgl/shader/compileShader'
], function(
	loadFile,
	compileShader
) {
	return function loadShader(gl, fileName, shaderType, callback) {
		var glShaderType;
		if(shaderType === 'vertex') {
			glShaderType = gl.VERTEX_SHADER;
		}
		else if(shaderType === 'fragment') {
			glShaderType = gl.FRAGMENT_SHADER;
		}
		else {
			 throw('*** Error: shader type not set');
		}
		if(callback) {
			loadFile('/shaders/' + shaderType + '/' + fileName + '.c', function(file) {
				callback(compileShader(gl, file, glShaderType));
			});
		}
		else {
			return compileShader(gl, loadFile('/shaders/' + shaderType + '/' + fileName + '.c'), glShaderType);
		}
	};
});