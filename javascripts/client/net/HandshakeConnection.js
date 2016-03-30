define([
	'net/Connection',
	'shared/util/DelayQueue',
	'shared/util/EventHelper',
	'shared/util/now',
	'cookies-js'
], function(
	Connection,
	DelayQueue,
	EventHelper,
	now,
	Cookies
) {
	var SESSION_COOKIE_KEY = 'client_session_id';

	function HandshakeConnection() {
		var self = this;
		this._bufferedMessages = [];
		this._isAwaitingHandshake = false;
		this._hasHandshaked = false;
		this._sessionId = Cookies.get(SESSION_COOKIE_KEY);
		this._events = new EventHelper([ 'connect', 'handshake', 'receive', 'disconnect' ]);

		//bind connection handlers
		this._conn = new Connection();
		this._conn.on('connect', function(isReconnect) {
			//initiate handshake
			this._isAwaitingHandshake = true;
			this._events.trigger('connect');
			this._bufferedMessages.push({
				type: 'handshake-request',
				connectParams: { sessionId: this._sessionId }
			});
			this.flush();
		}, this);
		this._conn.on('receive', function(messages) {
			for(var i = 0; i < messages.length; i++) {
				var msg = messages[i];
				if(msg.type === 'handshake-accept' && this._isAwaitingHandshake) {
					//handshake accepted!
					this._sessionId = msg.connectParams.sessionId;
					Cookies.set(SESSION_COOKIE_KEY, this._sessionId);
					this._hasHandshaked = true;
					this._isAwaitingHandshake = false;
					this._events.trigger('handshake', msg.connectParams);
				}
				else if(msg.type === 'message' && this.isConnected()) {
					this._events.trigger('receive', msg.msg);
				}
			}
		}, this);
		this._conn.on('disconnect', function() {
			this._hasHandshaked = false;
			this._isAwaitingHandshake = false;
			this._events.trigger('disconnect');
		}, this);
	}
	HandshakeConnection.prototype.buffer = function(msg) {
		if(this.isConnected()) {
			this._bufferedMessages.push({ type: 'message', msg: msg });
		}
	};
	HandshakeConnection.prototype.flush = function() {
		if(this.isConnected()) {
			this._conn.send(this._bufferedMessages);
			this._bufferedMessages = [];
		}
	};
	HandshakeConnection.prototype.send = function(msg) {
		this.buffer(msg);
		this.flush();
	};
	HandshakeConnection.prototype.connect = function() {
		this._conn.connect();
	};
	HandshakeConnection.prototype.isConnected = function() {
		return this._conn.isConnected();
	};
	HandshakeConnection.prototype.hasHandshaked = function() {
		return this._conn.isConnected() && this._hasHandshaked;
	};
	HandshakeConnection.prototype.empty = function() {
		this._bufferedMessages = [];
	};
	HandshakeConnection.prototype.isEmpty = function() {
		return this._bufferedMessages.length === 0;
	};
	HandshakeConnection.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	return HandshakeConnection;
});