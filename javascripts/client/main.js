define([
	'global',
	'display/canvas',
	'Game',
	'socket.io',
	'webgl/createProgramFromFiles'
], function(
	global,
	canvas,
	Game,
	createSocket,
	createProgramFromFiles
) {
	return function main() {
		//set up socket io
		var socket = createSocket();
		socket.on('connect', function() {
			console.log('connect');
		});
		socket.on('message', function(msg) {
			console.log('message', msg);
		});
		socket.on('disconnect', function(){
			console.log('disconnect');
		});

		//get A WebGL context
		var gl = canvas.getContext('experimental-webgl');
		if(!gl) {
			gl = canvas.getContext('webgl');
		}

		//keep track of when the window has been resized
		var windowHasBeenResized = true;
		window.addEventListener('resize', function() {
			windowHasBeenResized = true;
		});

		//setup a GLSL program
		program = createProgramFromFiles(gl, '3d-texture', '3d-texture-4tap', function(program) {
			//create a new game
			var game = new Game(gl, program);

			//kick off the game loop
			var then = null;
			function loop(now) {
				now /= 1000;

				//update the game
				if(then) {
					var t = now - then;
					game.update(t);
				}
				then = now;

				//resize the canvas if needed
				if(windowHasBeenResized) {
					windowHasBeenResized = false;
					var size = Math.min(window.innerWidth / global.CANVAS_WIDTH,
						window.innerHeight / global.CANVAS_HEIGHT);
					canvas.width = size * global.CANVAS_WIDTH;
					canvas.height = size * global.CANVAS_HEIGHT;
					gl.viewport(0, 0, canvas.width, canvas.height);
					game.recalculateProjectionMatrix();
				}

				//render the game
				game.render(gl, program);

				//schedule the next loop
				requestAnimationFrame(loop);
			}
			requestAnimationFrame(loop);
		});
	};
});