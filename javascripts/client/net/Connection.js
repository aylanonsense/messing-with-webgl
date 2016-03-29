define([
	'socket.io',
	'net/generateFakeLag',
	'shared/util/DelayQueue',
	'shared/util/EventHelper',
	'shared/util/now'
], function(
	createSocket,
	generateFakeLag,
	DelayQueue,
	EventHelper,
	now
) {
	function Connection() {
		var self = this;
		this._socket = null;
		this._isConnecting = false;
		this._isConnected = false;
		this._isActuallyConnected = false;
		this._hasConnectedBefore = false;
		this._events = new EventHelper([ 'connect', 'receive', 'disconnect' ]);

		//set up message queues (allows us to add fake lag)
		this._inbound = new DelayQueue();
		this._inbound.on('dequeue', function(evt) {
			if(evt.type === 'message' && self._isConnected) {
				self._events.trigger('receive', evt);
			}
			else if(evt.type === 'connect') {
				self._isConnected = true;
				self._isConnecting = false;
				self._events.trigger('connect', self._hasConnectedBefore); //isReconnect
				self._hasConnectedBefore = true;
			}
			else if(evt.type === 'disconnect') {
				self._isConnected = false;
				self._isConnecting = false;
				self._outbound.empty();
				self._events.trigger('disconnect');
			}
		});
		this._outbound = new DelayQueue();
		this._outbound.on('dequeue', function(evt) {
			if(evt.type === 'message' && self._isConnected && self._isActuallyConnected) {
				self._socket.emit('message', evt.msg);
			}
			else if(evt.type === 'connect') {
				self._socket = createSocket();
				self._socket.on('connect', function() {
					self._isActuallyConnected = true;
					self._inbound.enqueue({ type: 'connect' }, now() + generateFakeLag());
				});
				self._socket.on('message', function(msg) {
					self._inbound.enqueue({ type: 'message', msg: msg }, now() + generateFakeLag());
				});
				self._socket.on('disconnect', function() {
					self._isActuallyConnected = false;
					self._inbound.enqueue({ type: 'disconnect' }, now() + generateFakeLag());
				});
			}
		});
	}
	Connection.prototype.send = function(msg) {
		if(this._isConnected && this._isActuallyConnected) {
			this._outbound.enqueue({ type: 'message', msg: msg }, now() + generateFakeLag());
		}
	};
	Connection.prototype.connect = function() {
		var self = this;
		if(!this._isConnecting && !this._isConnected) {
			this._isConnecting = true;
			this._outbound.enqueue({ type: 'connect' }, now() + generateFakeLag());
		}
	};
	//TODO disconnect?
	Connection.prototype.isConnected = function() {
		return this._isConnected;
	};
	Connection.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	return Connection;
});