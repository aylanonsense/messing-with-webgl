define(function() {
	return function loadFile(filePath, callback) {
		var async = !!callback, numFilesLoaded, files;
		function loadIndividualFileWrapped(filePath2, i) {
			loadIndividualFile(filePath2, function(file) {
				files[i] = file;
				numFilesLoaded++;
				if(numFilesLoaded === filePath.length) {
					callback(files);
				}
			});
		}
		if(filePath instanceof Array) {
			numFilesLoaded = 0;
			files = [];
			for(var i = 0; i < filePath.length; i++) {
				if(async) {
					loadIndividualFileWrapped(filePath[i], i);
				}
				else {
					files[i] = loadIndividualFile(filePath[i]);
				}
			}
			return files;
		}
		else {
			return loadIndividualFile(filePath, callback);
		}
	};

	function loadIndividualFile(filePath, callback) {
		var async = !!callback;
		var xhr = new XMLHttpRequest();
		function onreadystatechange() {
			if(xhr.readyState === 4 && callback) {
				callback(xhr.responseText);
			}
		}
		xhr.open('get', filePath, !!callback);
		if(callback) {
			xhr.onreadystatechange = onreadystatechange;
		}
		xhr.send(null);
		onreadystatechange();
		return xhr.responseText;
	}
});