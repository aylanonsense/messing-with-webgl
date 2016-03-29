define(function() {
	//we have to check to see if we're on the server or the client (gross)

	//the client just uses performance.now()
	if(this.performance) {
		return function() {
			return performance.now() / 1000;
		};
	}

	//the server uses the performance-now npm module that acts like performance.now()
	else {
		var performanceNow = require('performance-now');
		return function() {
			return performanceNow() / 1000;
		};
	}
});