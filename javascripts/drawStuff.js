define(function() {
	return function drawStuff(gl, program, canvas) {
		//get locations of shader variables
		var positionLocation = gl.getAttribLocation(program, "a_position");
		var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		var colorLocation = gl.getUniformLocation(program, "u_color");
		var matrixLocation = gl.getUniformLocation(program, "u_matrix");

		//program vars
		var angleInDegrees = 30;
		var angleInRadians = angleInDegrees * Math.PI / 180;
		var translation = [ 100, 200 ];
		var rotation = [Math.sin(angleInRadians), Math.cos(angleInRadians)];
		var scale = [0.8, 0.8];

		//create a buffer
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		//put geometry into the buffer
		setGeometry(gl);

		//set a random color
		gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

		//draw the scene
		drawScene();

		//---HELPER METHODS---
		//returns a random integer from 0 to range - 1
		function randomInt(range) {
			return Math.floor(Math.random() * range);
		}

		//fill the buffer with the values that define a letter 'F'
		function setGeometry(gl) {
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
				// left column
				0, 0,
				30, 0,
				0, 150,
				0, 150,
				30, 0,
				30, 150,
				// top rung
				30, 0,
				100, 0,
				30, 30,
				30, 30,
				100, 0,
				100, 30,
				// middle rung
				30, 60,
				67, 60,
				30, 90,
				30, 90,
				67, 60,
				67, 90]), gl.STATIC_DRAW);
		}

		function matrixMultiply(a, b) {
			var a00 = a[0*3+0];
			var a01 = a[0*3+1];
			var a02 = a[0*3+2];
			var a10 = a[1*3+0];
			var a11 = a[1*3+1];
			var a12 = a[1*3+2];
			var a20 = a[2*3+0];
			var a21 = a[2*3+1];
			var a22 = a[2*3+2];
			var b00 = b[0*3+0];
			var b01 = b[0*3+1];
			var b02 = b[0*3+2];
			var b10 = b[1*3+0];
			var b11 = b[1*3+1];
			var b12 = b[1*3+2];
			var b20 = b[2*3+0];
			var b21 = b[2*3+1];
			var b22 = b[2*3+2];
			return [
				a00 * b00 + a01 * b10 + a02 * b20,
				a00 * b01 + a01 * b11 + a02 * b21,
				a00 * b02 + a01 * b12 + a02 * b22,
				a10 * b00 + a11 * b10 + a12 * b20,
				a10 * b01 + a11 * b11 + a12 * b21,
				a10 * b02 + a11 * b12 + a12 * b22,
				a20 * b00 + a21 * b10 + a22 * b20,
				a20 * b01 + a21 * b11 + a22 * b21,
				a20 * b02 + a21 * b12 + a22 * b22
			];
		}

		function makeIdentity() {
			return [
				1, 0, 0,
				0, 1, 0,
				0, 0, 1
			];
		}

		function make2DProjection(width, height) {
			//note: This matrix flips the Y axis so that 0 is at the top.
			return [
				2 / width, 0, 0,
				0, -2 / height, 0,
				-1, 1, 1
			];
		}

		function makeTranslation(tx, ty) {
			return [
				1, 0, 0,
				0, 1, 0,
				tx, ty, 1
			];
		}

		function makeRotation(angleInRadians) {
			var c = Math.cos(angleInRadians);
			var s = Math.sin(angleInRadians);
			return [
				c,-s, 0,
				s, c, 0,
				0, 0, 1
			];
		}

		function makeScale(sx, sy) {
			return [
				sx, 0, 0,
				0, sy, 0,
				0, 0, 1
			];
		}

		//draw the scene
		function drawScene() {
			//clear the canvas
			gl.clear(gl.COLOR_BUFFER_BIT);

			//compute the matrices
			var translationMatrix = makeTranslation(translation[0], translation[1]);
			var rotationMatrix = makeRotation(angleInRadians);
			var scaleMatrix = makeScale(scale[0], scale[1]);
			var projectionMatrix = make2DProjection(canvas.clientWidth, canvas.clientHeight);

			var matrix = makeIdentity();
			matrix = matrixMultiply(matrix, scaleMatrix);
			matrix = matrixMultiply(matrix, rotationMatrix);
			matrix = matrixMultiply(matrix, translationMatrix);
			matrix = matrixMultiply(matrix, projectionMatrix);

			//set the matrix
			gl.uniformMatrix3fv(matrixLocation, false, matrix);

			//draw the geometry
			gl.drawArrays(gl.TRIANGLES, 0, 18);
		}

		setInterval(function() {
			drawScene();
		}, 1000 / 30);
	};
});