var ttn = require('ttn');
var appEUI = '70B3D57ED00004CC';
var accessKey = 'oJw2OCZ4DW7PSzaJYrtBuJ1wW8mG1HcNd9vuyxChaX4=';
var client = new ttn.Client('staging.thethingsnetwork.org', appEUI, accessKey);

client.on('uplink', function (msg) {
  console.log('Received message', msg);
});

client.on('activation', function (msg) {
  console.log('Device activated:', msg.devEUI);
});

