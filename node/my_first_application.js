var ttn = require('ttn');
var appEUI = '70B3D57ED0000457';
var accessKey = 'uflhnjIhWQ9X+N4BvI/356TpKHr9GrKzFpS7BoQpEWI=';
var client = new ttn.Client('staging.thethingsnetwork.org', appEUI, accessKey);

client.on('uplink', function (msg) {
  console.log('Received message', msg);
});

client.on('activation', function (msg) {
  console.log('Device activated:', msg.devEUI);
});

