define([
	'webgl/createProgram',
	'webgl/shader/compileShaderFromFile'
], function(
	createProgram,
	compileShaderFromFile
) {
	/**
	 * Creates a program from 2 script tags.
	 *
	 * @param {!WebGLRenderingContext} gl The WebGL Context.
	 * @param {string} vertexShaderFileName The file name of the vertex shader.
	 * @param {string} fragmentShaderFileName The file name of the fragment shader.
	 * @return {!WebGLProgram} A program
	 */
	return function createProgramFromScripts(gl, vertexShaderFileName, fragmentShaderFileName, callback) {
		var async = !!callback;
		if(async) {
			compileShaderFromFile(gl, vertexShaderFileName, 'vertex', function(vertexShader) {
				compileShaderFromFile(gl, fragmentShaderFileName, 'fragment', function(fragmentShader) {
					callback(createProgram(gl, vertexShader, fragmentShader));
				});
			});
		}
		else {
			return createProgram(gl,
				compileShaderFromFile(gl, vertexShaderFileName, 'vertex'),
				compileShaderFromFile(gl, fragmentShaderFileName, 'fragment'));
		}
	};
});