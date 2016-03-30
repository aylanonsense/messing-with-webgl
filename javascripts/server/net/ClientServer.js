define([
	'socket.io',
	'net/Client',
	'net/HandshakeConnection',
	'shared/util/EventHelper'
], function(
	createSocketServer,
	Client,
	HandshakeConnection,
	EventHelper
) {
	function ClientServer(server) {
		this._events = new EventHelper([ 'connect' ]);
		this._clients = [];
		this._server = null;
	}
	ClientServer.prototype.startListening = function(server) {
		var self = this;

		//start listening for connections
		this._server = createSocketServer(server);
		this._server.on('connection', function(socket) {
			//create a new connection object
			var conn = new HandshakeConnection(socket);
			//when there is a handshake, create a client
			conn.on('handshake', function(connectParams) {
				conn.acceptHandshake({ sessionId: 'abc' });
				var client = new Client({ conn: conn });
				this._clients.push(client);
				//if that client disconnects, remove it from the list of clients
				conn.on('disconnect', function() {
					this._clients = this._clients.filter(function(otherClient) {
						return !client.sameAs(otherClient);
					});
				}, this);
				this._events.trigger('connect', client);
			}, self);
		});
	};
	ClientServer.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	ClientServer.prototype.wfwfa = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	return ClientServer;
});