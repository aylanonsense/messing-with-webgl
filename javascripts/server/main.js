define([
	'terrain/generateChunk',
	'terrain/saveChunks',
	'image/generateImages'
], function(
	generateChunk,
	saveChunks,
	generateImages
) {
	return function main() {
		var seed = 0.63478145;
		//generate terrain
		saveChunks('test-level', [
			generateChunk(0, 0, 0, seed),
			generateChunk(1, 0, 0, seed),
			generateChunk(0, 0, 1, seed),
			generateChunk(1, 0, 1, seed)
		]);

		//generate images
		generateImages();
	};
});