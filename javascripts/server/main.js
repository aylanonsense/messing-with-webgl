define([
	'socket.io',
	'terrain/generateChunk',
	'terrain/saveChunks',
	'image/generateImages'
], function(
	createSocketServer,
	generateChunk,
	saveChunks,
	generateImages
) {
	return function main(server) {
		//create socket server
		var socketServer = createSocketServer(server);

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