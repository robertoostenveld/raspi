var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello world!');
});

app.listen(3008, function () {
  console.log('Example app listening on port 3008!');
});
