define([
	'terrain/generateTerrain',
	'terrain/saveTerrain'
], function(
	generateTerrain,
	saveTerrain
) {
	return function main() {
		var terrain = generateTerrain({ seed: 0.63478145, width: 32, height: 16, depth: 32 });
		saveTerrain('test-level', terrain);
	};
});