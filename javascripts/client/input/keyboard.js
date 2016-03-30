define([
	'config',
	'shared/util/EventHelper'
], function(
	clientConfig,
	EventHelper
) {
	var events = new EventHelper([ 'key-event' ]);
	var keyboardState = {};
	for(var key in clientConfig.KEY_BINDINGS) {
		keyboardState[clientConfig.KEY_BINDINGS[key]] = false;
	}

	//add keyboard handler
	function onKeyboardEvent(evt) {
		var isDown = (evt.type === 'keydown');
		if(clientConfig.KEY_BINDINGS[evt.which]) {
			evt.preventDefault();
			if(keyboardState[clientConfig.KEY_BINDINGS[evt.which]] !== isDown) {
				keyboardState[clientConfig.KEY_BINDINGS[evt.which]] = isDown;
				events.trigger('key-event', clientConfig.KEY_BINDINGS[evt.which], isDown, keyboardState);
			}
		}
	}
	document.onkeyup = onKeyboardEvent;
	document.onkeydown = onKeyboardEvent;

	return {
		onKeyEvent: function(callback, ctx) {
			return events.on.call(events, 'key-event', callback, ctx);
		},
		getState: function() {
			return keyboardState;
		}
	};
});