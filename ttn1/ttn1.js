var ttn = require('ttn');

var TTN1_SECRET = process.env.TTN1_SECRET;
var TTN1_APPID = process.env.TTN1_APPID;
var TTN1_ACCESSKEY = process.env.TTN1_ACCESSKEY;
var client = new ttn.Client('eu.thethings.network', TTN1_APPID, TTN1_ACCESSKEY);

client.on('connect', function(connack) {
  console.log('[DEBUG]', 'Connect:', connack);
});

client.on('error', function(err) {
  console.error('[ERROR]', err.message);
});

client.on('activation', function(deviceId, data) {
  console.log('[INFO] ', 'Activation:', deviceId, JSON.stringify(data, null, 2));
});

client.on('message', function(deviceId, data) {
  console.info('[INFO] ', 'Message:', deviceId, JSON.stringify(data, null, 2));
});

client.on('message', null, 'led', function(deviceId, led) {

  // Toggle the LED
  var payload = {
    led: !led
  };

  // If you don't have an encoder payload function:
  // var payload = [led ? 0 : 1];

  console.log('[DEBUG]', 'Sending:', JSON.stringify(payload));
  client.send(deviceId, payload);
});
