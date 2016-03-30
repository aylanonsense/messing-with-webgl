define([
	'terrain/generateChunk',
	'terrain/saveChunks',
	'image/generateImages',
	'net/server'
], function(
	generateChunk,
	saveChunks,
	generateImages,
	server
) {
	return function main(expressServer) {
		//create socket server
		server.startListening(expressServer);

		//generate terrain
		var seed = 0.782910;
		saveChunks('test-level', [
			generateChunk(0, 0, 0, seed),

			generateChunk(1, 0, 0, seed),
			generateChunk(1, 0, 1, seed),
			generateChunk(0, 0, 1, seed),
			generateChunk(-1, 0, 1, seed),
			generateChunk(-1, 0, 0, seed),
			generateChunk(-1, 0, -1, seed),
			generateChunk(0, 0, -1, seed),
			generateChunk(1, 0, -1, seed),

			generateChunk(-2, 0, 0, seed),
			generateChunk(-2, 0, -1, seed),
			generateChunk(-2, 0, -2, seed),
			generateChunk(-1, 0, -2, seed),
			generateChunk(0, 0, -2, seed),
			generateChunk(1, 0, -2, seed),
			generateChunk(2, 0, -2, seed),
			generateChunk(2, 0, -1, seed),
			generateChunk(2, 0, 0, seed),
			generateChunk(2, 0, 1, seed),
			generateChunk(2, 0, 2, seed),
			generateChunk(1, 0, 2, seed),
			generateChunk(0, 0, 2, seed),
			generateChunk(-1, 0, 2, seed),
			generateChunk(-2, 0, 2, seed),
			generateChunk(-2, 0, 1, seed)
		]);

		//generate images
		generateImages();
	};
});