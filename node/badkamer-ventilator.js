// This code subscribes to incoming messages on an internal MQTT server
// and forwards them to an external MQTT server. Furthermore, the humidity
// value is checked and a tasmota switch is used to switch the ventolator
// on or off.

var moment = require('moment')
var mqtt = require('mqtt');

var MQTT1_SERVER    = process.env.MQTT1_SERVER    
var MQTT1_PORT      = process.env.MQTT1_PORT      
var MQTT1_USERNAME  = process.env.MQTT1_USERNAME  
var MQTT1_PASSWORD  = process.env.MQTT1_PASSWORD  

var MQTT2_SERVER    = process.env.MQTT2_SERVER    
var MQTT2_PORT      = process.env.MQTT2_PORT      
var MQTT2_USERNAME  = process.env.MQTT2_USERNAME  
var MQTT2_PASSWORD  = process.env.MQTT2_PASSWORD  

options1 = {port: MQTT1_PORT, username: MQTT1_USERNAME, password: MQTT1_PASSWORD};
options2 = {port: MQTT2_PORT, username: MQTT2_USERNAME, password: MQTT2_PASSWORD};

var client1 = mqtt.connect(MQTT1_SERVER, options1);
var client2 = mqtt.connect(MQTT2_SERVER, options2);

client2.on('connect', function () {
  // this is the one to which the messages get forwarded
  console.log('connected to ' + MQTT2_SERVER);
});

client1.on('connect', function () {
  // this is the one from which the messages originate
  console.log('connected to ' + MQTT1_SERVER);
  client1.subscribe('badkamer/tele/SENSOR');
});

var state         = 'UNKNOWN';
var SWITCH_ON     = 60 
var SWITCH_OFF    = 20
var SWITCH_DEVICE = "tasmota4"

client1.on('message', function (topic, message) {
  var now = moment().format('YYYY-MM-DD HH:mm:ss')
  data = JSON.parse(message.toString());

  // console.log(now);
  // console.log(data);
  client2.publish(MQTT2_USERNAME + '/feeds/temperature', String(data.AM2301.Temperature));
  client2.publish(MQTT2_USERNAME + '/feeds/humidity', String(data.AM2301.Humidity));

  // switch the ventilator
  if (data.AM2301.Humidity > SWITCH_ON) {
    if (state != 'ON') {
      state = 'ON';
      console.log(now + ' switched ' + state);
    }
    client1.publish(SWITCH_DEVICE + '/cmnd/power', state);
  }
  else if (data.AM2301.Humidity < SWITCH_OFF) {
    if (state != 'OFF') {
      state = 'OFF';
      console.log(now + ' switched ' + state);
    }
    client1.publish(SWITCH_DEVICE + '/cmnd/power', state);
  }

});

