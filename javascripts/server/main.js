define([
	'terrain/generateTerrain',
	'terrain/saveTerrain'
], function(
	generateTerrain,
	saveTerrain
) {
	return function main() {
		var terrain = generateTerrain({ seed: 0.63478145, width: 96, height: 32, depth: 96 });
		saveTerrain('test-level', terrain);
	};
});