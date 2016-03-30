define([
	'shared/util/EventHelper'
], function(
	EventHelper
) {
	function Client(params) {
		this._events = new EventHelper([ 'disconnect' ]);
		this._conn = params.conn;
		this._conn.on('disconnect', function() {
			this._events.trigger('disconnect');
		}, this);
	}
	Client.prototype.sameAs = function(otherClient) {
		return otherClient && otherClient._conn.sameAs(this._conn);
	};
	return Client;
});