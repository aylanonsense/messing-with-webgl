define([
	'terrain/generateTerrain',
	'terrain/saveTerrain',
	'image/generateImages'
], function(
	generateTerrain,
	saveTerrain,
	generateImages
) {
	return function main() {
		//generate terrain
		var terrain = generateTerrain({ seed: 0.63478145, width: 32, height: 16, depth: 32 });
		saveTerrain('test-level', terrain);

		//generate images
		generateImages();
	};
});