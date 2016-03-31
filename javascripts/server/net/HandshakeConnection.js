define([
	'shared/util/EventHelper',
	'net/Connection'
], function(
	EventHelper,
	Connection
) {
	function HandshakeConnection(socket) {
		this._bufferedMessages = [];
		this._hasReceivedHandshake = false;
		this._hasAcceptedHandshake = false;
		this._events = new EventHelper([ 'handshake', 'receive', 'disconnect' ]);

		//bind connection handlers
		this._conn = new Connection(socket);
		this._conn.on('receive', function(messages) {
			for(var i = 0; i < messages.length; i++) {
				var msg = messages[i];
				if(msg.type === 'handshake-request' && !this._hasReceivedHandshake) {
					this._hasReceivedHandshake = true;
					this._events.trigger('handshake', msg.connectParams);
				}
				else if(msg.type === 'message') {
					this._events.trigger('receive', msg.msg);
				}
			}
		}, this);
		this._conn.on('disconnect', function() {
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
		if(this.hasHandshaked()) {
			this.buffer(msg);
			this.flush();
		}
	};
	HandshakeConnection.prototype.acceptHandshake = function(session) {
		if(this._conn.isConnected()) {
			this._hasAcceptedHandshake = true;
			this._bufferedMessages.push({
				type: 'handshake-accept',
				session: session
			});
			this.flush();
		}
	};
	HandshakeConnection.prototype.rejectHandshake = function() {
		if(this._conn.isConnected()) {
			this._bufferedMessages.push({
				type: 'handshake-reject'
			});
			this.flush();
			this.disconnect();
		}
	};
	HandshakeConnection.prototype.isConnected = function() {
		return this._conn.isConnected();
	};
	HandshakeConnection.prototype.hasHandshaked = function() {
		return this._conn.isConnected && this._hasAcceptedHandshake;
	};
	HandshakeConnection.prototype.disconnect = function() {
		this._conn.disconnect();
	};
	HandshakeConnection.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	HandshakeConnection.prototype.sameAs = function(other) {
		return other && this._conn.sameAs(other._conn);
	};
	return HandshakeConnection;
});