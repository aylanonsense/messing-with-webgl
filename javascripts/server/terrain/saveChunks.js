define([
	'fs'
], function(
	fs
) {
	return function saveChunks(fileName, chunks, callback) {
		var filePath = './data/terrain/' + fileName + '.json';

		//create file
		fs.closeSync(fs.openSync(filePath, 'w'));

		//write to file
		fs.writeFile(filePath, JSON.stringify(chunks), callback);
	};
});