define([
	'util/loadFile'
], function(
	loadFile
) {
	return function loadTerrain(fileName, callback, ctx) {
		loadFile('/data/terrain/' + fileName + '.json', function(txt) {
			callback.call(ctx, JSON.parse(txt));
		});
	};
});