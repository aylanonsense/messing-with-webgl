define([
	'global',
	'display/canvas',
	'Game',
	'shared/util/now',
	'net/Connection',
	'webgl/createProgramFromFiles'
], function(
	global,
	canvas,
	Game,
	now,
	Connection,
	createProgramFromFiles
) {
	return function main() {
		//set up socket io
		var conn = new Connection();
		conn.on('connect', function() {
			console.log('connect');
		});
		conn.on('receive', function(msg) {
			console.log('receive', msg);
		});
		conn.on('disconnect', function(){
			console.log('disconnect');
		});
		conn.connect();

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
			var prevTime = null;
			function loop() {
				var currTime = now();

				//update the game
				if(prevTime) {
					var t = currTime - prevTime;
					game.update(t);
				}
				prevTime = currTime;

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