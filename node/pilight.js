var net = require('net');

var client = new net.Socket();

var HOST = '192.168.1.2';
var PORT = 5000;

client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    var message = '{ "action": "identify", "options": { "core": 1, "receiver": 1, "config": 1, "forward": 0 }, "uuid": "0000-d0-63-00-000000", "media": "all"}';
    client.write(message);

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    // client.destroy();
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

