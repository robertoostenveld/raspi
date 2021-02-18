// This code subscribes to incoming sensor data on an internal MQTT server
// and forwards them to an external MQTT server. Furthermore, the humidity
// value is used to switch a ventilator on or off.

var mqtt = require('mqtt');

var MQTT1_SERVER    = process.env.MQTT1_SERVER    
var MQTT1_PORT      = process.env.MQTT1_PORT      
var MQTT1_USERNAME  = process.env.MQTT1_USERNAME  
var MQTT1_PASSWORD  = process.env.MQTT1_PASSWORD  

var MQTT2_SERVER    = process.env.MQTT2_SERVER    
var MQTT2_PORT      = process.env.MQTT2_PORT      
var MQTT2_USERNAME  = process.env.MQTT2_USERNAME  
var MQTT2_PASSWORD  = process.env.MQTT2_PASSWORD  

options1 = {port: MQTT1_PORT, username: MQTT1_USERNAME, password: MQTT1_PASSWORD, reconnectPeriod: 15000};
options2 = {port: MQTT2_PORT, username: MQTT2_USERNAME, password: MQTT2_PASSWORD, reconnectPeriod: 15000};

var client1 = mqtt.connect(MQTT1_SERVER, options1);
var client2 = mqtt.connect(MQTT2_SERVER, options2);

client1.on('connect', function () {
  // this is the one from which the messages originate
  console.log('connected to ' + MQTT1_SERVER);
  client1.subscribe('tele/badkamer/SENSOR');
  client1.subscribe('tele/ventilator/STATE');
});

client1.on('reconnect', function () {
  // this is the one from which the messages originate
  console.log('reconnected to ' + MQTT1_SERVER);
  client1.subscribe('tele/badkamer/SENSOR');
  client1.subscribe('tele/ventilator/STATE');
});

client1.on('error', function(err) {
  console.log('error connecting to ' + MQTT1_SERVER);
  // client1.end();
});

client2.on('connect', function () {
  // this is the one to which the messages get forwarded
  console.log('connected to ' + MQTT2_SERVER);
});

client2.on('reconnect', function () {
  // this is the one to which the messages get forwarded
  console.log('reconnected to ' + MQTT2_SERVER);
});

client2.on('error', function(err) {
  console.log('error connecting to ' + MQTT2_SERVER);
  // client2.end();
});

var HUMIDITY = null
var LAMBDA = 0.01
var LEVEL2 = 70	        // fast, in percent
var LEVEL1 = 30	        // slow, in percent
var LEVEL0 = 0	        // off
var DURATION2 = 20*60*1000 // fast, in minutes*seconds*milliseconds
var DURATION1 = 40*60*1000 // slow, in minutes*seconds*milliseconds

var PREVIOUS = Date.now()
var STATE = 0
var LEVEL = LEVEL0

client1.on('message', function (topic, message) {
  now = Date.now();
  data = JSON.parse(message.toString());
  // console.log(data);

  if (topic == 'tele/ventilator/STATE') {
    if (data.POWER == 'OFF') {
      client2.publish(MQTT2_USERNAME + '/feeds/ventilator', String(0));
    }
    else {
      client2.publish(MQTT2_USERNAME + '/feeds/ventilator', String(data.Dimmer));
    }
  } 

  if (topic == 'tele/badkamer/SENSOR') {
    if (HUMIDITY == null) {
      HUMIDITY = 1.0 * data.BME280.Humidity;
    }
    else {
      HUMIDITY = LAMBDA * data.BME280.Humidity + (1.0-LAMBDA) * HUMIDITY;
    }

    if (STATE < 2 && (data.BME280.Humidity - HUMIDITY) > 10) {
      console.log('switch the fan to high when the humidity increases with 10%')
      STATE = 2;
      LEVEL = LEVEL2;
      CHANGE = true;
      PREVIOUS = Date.now();
    }
    else if (STATE == 2 && now>(PREVIOUS+DURATION2)) {
      console.log('switch the fan to low after some time')
      STATE = 1;
      LEVEL = LEVEL1;
      CHANGE = true;
      PREVIOUS = Date.now();
    }
    else if (STATE == 1 && now>(PREVIOUS+DURATION1)) {
      console.log('switch the fan off after some time')
      STATE = 0;
      LEVEL = LEVEL0;
      CHANGE = true;
      PREVIOUS = Date.now();
    }
    else {
      CHANGE = false;
    }

    if (CHANGE) {
      if (LEVEL>0) {
        client1.publish('cmnd/ventilator/POWER', 'ON');
        client1.publish('cmnd/ventilator/Dimmer', String(LEVEL));
      }                        
      else {                   
        client1.publish('cmnd/ventilator/Dimmer', String(LEVEL));
        client1.publish('cmnd/ventilator/POWER', 'OFF');
      }
      console.log(data);
      console.log('HUMIDITY ' + HUMIDITY);
      console.log('STATE ' + STATE);
      console.log('LEVEL ' + LEVEL);
    }

    client2.publish(MQTT2_USERNAME + '/feeds/temperature', String(data.BME280.Temperature));
    client2.publish(MQTT2_USERNAME + '/feeds/humidity', String(data.BME280.Humidity));
    client2.publish(MQTT2_USERNAME + '/feeds/pressure', String(data.BME280.Pressure));
  }

});

