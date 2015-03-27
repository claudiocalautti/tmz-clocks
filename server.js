var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();


app.use('/', express.static(path.join(__dirname, 'src')));

app.get('/', function(req, res) {
  res.render('index', {});
});

app.listen(3000);

console.log('Server started: http://localhost:3000/');
