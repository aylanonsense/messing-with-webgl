define({
	//rendering
	CANVAS_WIDTH: 800,
	CANVAS_HEIGHT: 600,

	//input
	KEY_BINDINGS: {
		38: 'UP', 87: 'UP',			//up arrow key / w key
		37: 'LEFT', 65: 'LEFT',		//left arrow key / a key
		40: 'DOWN', 83: 'DOWN',		//down arrow key / s key
		39: 'RIGHT', 68: 'RIGHT',	//right arrow key / d key
		32: 'JUMP',					//space bar
		17: 'CROUCH',				//ctrl key
		16: 'SPRINT',				//shift key
		27: 'MENU'					//escape key
	},

	//network
	LOG_NETWORK_TRAFFIC: false
});