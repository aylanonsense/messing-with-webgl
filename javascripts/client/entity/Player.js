define([
	'input/keyboard',
	'input/mouse'
], function(
	keyboard,
	mouse
) {
	function Player(params) {
		this.pos = [ params.x || 0, params.y || 0, params.z || 0 ];
		this.horizontalDir = params.horizontalDir || 0;
		this.verticalDir = params.verticalDir || 0;

		mouse.onMouseEvent(function(type, x, y, dx, dy) {
			if(type === 'mousedown') {
				mouse.toggleLock();
			}
			if(mouse.isLocked()) {
				this.verticalDir = Math.min(Math.max(-Math.PI / 2 + 0.05,
					this.verticalDir + dy / 200), Math.PI / 2 - 0.05);
				this.horizontalDir -= dx / 150;
			}
		}, this);
	}
	Player.prototype.update = function(t) {
		if(mouse.isLocked()) {
			var keys = keyboard.getState();
			var moveSpeed = keys.SPRINT ? 500 : 100;
			var cosAngle = Math.cos(this.horizontalDir);
			var sinAngle = Math.sin(this.horizontalDir);
			if(keys.UP !== keys.DOWN) {
				this.pos[0] += sinAngle * moveSpeed * t * (keys.UP ? 1 : -1);
				this.pos[2] += cosAngle * moveSpeed * t * (keys.UP ? 1 : -1);
			}
			if(keys.LEFT !== keys.RIGHT) {
				this.pos[0] += cosAngle * moveSpeed * t * (keys.LEFT ? 1 : -1);
				this.pos[2] -= sinAngle * moveSpeed * t * (keys.LEFT ? 1 : -1);
			}
			if(keys.JUMP !== keys.CROUCH) {
				this.pos[1] += moveSpeed * t * (keys.JUMP ? 1 : -1);
			}
		}
	};
	return Player;
});