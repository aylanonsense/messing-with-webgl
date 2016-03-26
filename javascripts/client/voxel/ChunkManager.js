define([
	'voxel/Chunk'
], function(
	Chunk
) {
	function ChunkManager() {
		this.chunks = [];
		this.vertices = [];
	}
	ChunkManager.prototype.addChunk = function(x, y, z, blockTypes) {
		this.chunks.push(new Chunk({ x: x, y: y, z: z, blockTypes: blockTypes }));
	};
	return ChunkManager;
});