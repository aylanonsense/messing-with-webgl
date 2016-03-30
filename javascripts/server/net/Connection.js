define([
	'config',
	'shared/util/EventHelper'
], function(
	serverConfig,
	EventHelper
) {
	var nextConnId = 0;

	function Connection(socket) {
		var self = this;
		this._connId = nextConnId++;
		this._events = new EventHelper([ 'receive', 'disconnect' ]);

		//handle the socket
		this._socket = socket;
		this._isConnected = true;
		if(serverConfig.LOG_NETWORK_TRAFFIC) { console.log('[' + this._connId + '] connected'); }
		this._socket.on('message', function(msg) {
			if(serverConfig.LOG_NETWORK_TRAFFIC) { console.log('[' + self._connId + '] received:', msg); }
			self._events.trigger('receive', msg);
		});
		this._socket.on('disconnect', function() {
			self._isConnected = false;
			if(serverConfig.LOG_NETWORK_TRAFFIC) { console.log('[' + self._connId + '] disconnected'); }
			self._events.trigger('disconnect');
		});
	}
	Connection.prototype.send = function(msg) {
		if(serverConfig.LOG_NETWORK_TRAFFIC) { console.log('[' + this._connId + '] sent:', msg); }
		this._socket.emit('message', msg);
	};
	Connection.prototype.isConnected = function() {
		return this._isConnected;
	};
	Connection.prototype.disconnect = function() {
		this._socket.disconnect();
	};
	Connection.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	Connection.prototype.sameAs = function(other) {
		return other && other._connId === this._connId;
	};
	return Connection;
});