define(function() {
	return function drawStuff(gl, program, canvas) {
		gl.useProgram(program);

		//look up where the vertex data needs to go.
		var positionLocation = gl.getAttribLocation(program, "a_position");

		//set the resolution
		var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

		//create a buffer and put a single clipspace rectangle in it (2 triangles)
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			10, 20,
			80, 20,
			10, 30,
			10, 30,
			80, 20,
			80, 30]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		//draw
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};
});