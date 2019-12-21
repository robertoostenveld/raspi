var net = require('net');
var express = require('express');
var app = express();

// host and port running the pilight ssdp server
var PILIGHT_HOST = '192.168.1.16';
var PILIGHT_PORT = 5000;

// port running this http server
var PORT = 3006;

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

app.get([], function (req, res) {
  // incoming requests should look like http://hostname:port/device/state
  arr = req.url.split('/');
  if ( arr.length > 2 ) {
    var allowed_device = ['schakelaar1', 'schakelaar2', 'schakelaar3', 'schakelaar4', 'schakelaar5', 'schakelaar6', 'schakelaar7', 'schakelaar8', 'schakelaar9'];
    var allowed_state = ['on', 'off'];
    device = arr[1];
    state  = arr[2];
    if ( allowed_device.indexOf(device)>-1 && allowed_state.indexOf(state)>-1 ) {
      var message = '{"action": "control", "code": {"device": "' + device + '", "state": "' + state + '"}}';
      send_message(message);
      res.send('OK');
    }
    else {
      res.send('FAILED');
    }
  }
  else {
    res.send('FAILED');
  }
});

function send_message(message) {
  console.log('MESSAGE: ' + message);
  var client = new net.Socket();
  client.connect(PILIGHT_PORT, PILIGHT_HOST, function() {
  }).on('connect', function() {
      console.log('CONNECT');
      client.write(message);
  }).on('data', function(data) {
      console.log('DATA: ' + data);
      client.destroy();
  }).on('close', function() {
      console.log('CLOSE');
  }).on('error', function() {
      console.log('ERROR');
  });
};

