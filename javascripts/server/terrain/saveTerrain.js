define([
	'fs'
], function(
	fs
) {
	return function saveTerain(fileName, terrain, callback) {
		var filePath = './data/terrain/' + fileName + '.json';
		fs.closeSync(fs.openSync(filePath, 'w'));
		fs.writeFile(filePath, JSON.stringify(terrain), callback);
	};
});