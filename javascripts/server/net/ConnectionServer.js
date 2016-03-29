define([
	'socket.io',
	'net/Connection',
	'shared/util/EventHelper'
], function(
	createSocketServer,
	Connection,
	EventHelper
) {
	function ConnectionServer(server) {
		var self = this;
		this._events = new EventHelper([ 'connect' ]);
		this._connections = [];

		//start listening for connections
		this._server = createSocketServer(server);
		this._server.on('connection', function(socket) {
			var conn = new Connection(socket);
			self._connections.push(conn);
			conn.on('disconnect', function() {
				self._connections = self._connections.filter(function(otherConn) {
					return !conn.sameAs(otherConn);
				});
			});
			self._events.trigger('connect', conn);
		});
	}
	ConnectionServer.prototype.on = function(eventName, callback, ctx) {
		return this._events.on.apply(this._events, arguments);
	};
	return ConnectionServer;
});