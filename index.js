//run server
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/web'));
app.use('/javascripts', express.static(__dirname + '/javascripts'));
app.use('/shaders', express.static(__dirname + '/shaders'));
app.listen(process.env.PORT || 3000);