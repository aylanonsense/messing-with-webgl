define([
	'socket.io',
	'randomstring',
	'net/Client',
	'net/HandshakeConnection',
	'shared/util/EventHelper'
], function(
	createSocketServer,
	randomstring,
	Client,
	HandshakeConnection,
	EventHelper
) {
	function ClientServer(server) {
		this._events = new EventHelper([ 'connect' ]);
		this._clients = [];
		this._clientSessions = {};
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
				//create a new session if one does not already exist
				var sessionId = connectParams.sessionId;
				if(!this._clientSessions[sessionId]) {
					sessionId = randomstring.generate();
					this._clientSessions[sessionId] = {
						sessionId: sessionId,
						pos: [ 0, 200, 0 ]
					};
				}

				//send session to client
				var session = this._clientSessions[sessionId];
				conn.acceptHandshake(session);
				var client = new Client({ conn: conn, session: session });
				this._clients.push(client);

				//handle client post-handshake disconnects
				conn.on('disconnect', function() {
					//TODO update session
					//remove client from list of clients
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
	return ClientServer;
});