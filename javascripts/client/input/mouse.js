define([
	'shared/util/EventHelper',
	'display/canvas'
], function(
	EventHelper,
	canvas
) {
	var events = new EventHelper([ 'mouse-event' ]);
	var mouseX = 0;
	var mouseY = 0;

	//add mouse handler
	function onMouseEvent(evt) {
		mouseX = evt.clientX + document.body.scrollLeft;
		mouseY = evt.clientY + document.body.scrollTop;
		events.trigger('mouse-event', evt.type, mouseX, mouseY, evt.movementX, evt.movementY);
	}
	document.onmousedown = onMouseEvent;
	document.onmouseup = onMouseEvent;
	document.onmousemove = onMouseEvent;

	return {
		onMouseEvent: function(callback, ctx) {
			return events.on.call(events, 'mouse-event', callback, ctx);
		},
		getState: function() {
			return { x: mouseX, y: mouseY };
		},
		lock: function() {
			canvas.requestPointerLock();
		},
		unlock: function() {
			document.exitPointerLock();
		},
		toggleLock: function() {
			if(document.pointerLockElement) {
				document.exitPointerLock();
			}
			else {
				canvas.requestPointerLock();
			}
		},
		isLocked: function() {
			return !!document.pointerLockElement;
		}
	};
});