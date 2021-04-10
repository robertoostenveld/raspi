// This code subscribes to incoming sensor data on an internal MQTT server
// and forwards them to an external MQTT server. Furthermore, it uses
// the occupancy sensor, temperature, and time-of-day to switch the
// heating on or off.

var mqtt = require('mqtt');
var DateTime = require("luxon").DateTime;

var MEASURED = 20.0;                              // the initial measured temperature
var TARGET = 18.0;                                // the desired temperature
var OCCUPANCY = DateTime.local() - 1000*60*60*24; // set it to yesterday
var DELAY = 30*60*1000;                           // the delay up to the last detected occupancy
var HUMIDITY = 60;                                // this is forwarded, but not used otherwise

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
  client1.subscribe('tele/zigbee/SENSOR');
});

client2.on('connect', function () {
  // this is the one to which the messages get forwarded
  console.log('connected to ' + MQTT2_SERVER);
});

client1.on('reconnect', function () {
  // this is the one from which the messages originate
  console.log('reconnected to ' + MQTT1_SERVER);
  client1.subscribe('tele/zigbee/SENSOR');
});

client2.on('reconnect', function () {
  // this is the one to which the messages get forwarded
  console.log('reconnected to ' + MQTT2_SERVER);
});

client1.on('error', function(err) {
  console.log('error connecting to ' + MQTT1_SERVER);
  // client1.end();
});

client2.on('error', function(err) {
  console.log('error connecting to ' + MQTT2_SERVER);
  // client2.end();
});

/////////////////////////////////////////////////////////////////////////////////////////
// this section implements the rules
/////////////////////////////////////////////////////////////////////////////////////////

setInterval(function() {
  now = DateTime.local();
  time1 = DateTime.local(now.year, now.month, now.day, 8, 30);
  time2 = DateTime.local(now.year, now.month, now.day, 22, 00);
  recently = now - DELAY;

  client1.publish('tele/zolder/TARGET',   TARGET.toString());
  client1.publish('tele/zolder/MEASURED', MEASURED.toString());

  tmp = !(now<time1 || now>time2);
  client1.publish('tele/zolder/ACTIVE', tmp.toString());

  tmp = !(OCCUPANCY<recently);
  client1.publish('tele/zolder/OCCUPANCY', tmp.toString());

  if (now<time1 || now>time2) {
    console.log('it is outside of working hours');
    client1.publish('cmnd/tasmota7/POWER', 'OFF');
  } else if (OCCUPANCY<recently) {
    console.log('nobody has been present recently');
    client1.publish('cmnd/tasmota7/POWER', 'OFF');
  } else if (MEASURED>TARGET) {
    console.log('the temperature is above the threshold');
    client1.publish('cmnd/tasmota7/POWER', 'OFF');
  } else {
    console.log('turn on the heater');
    client1.publish('cmnd/tasmota7/POWER', 'ON');
  }

}, 5000);

/////////////////////////////////////////////////////////////////////////////////////////
// this section implements the updating and forwarding
/////////////////////////////////////////////////////////////////////////////////////////

client1.on('message', function (topic, message) {
  now = DateTime.local();

  data = JSON.parse(message.toString());

  console.log(topic);
  console.log(data);

  try {
    value = data.ZbReceived['0x690F'].Power;
    if (typeof value !== 'undefined' && value !== null) {
      if (value == 1) {
        TARGET = TARGET + 0.5;
        OCCUPANCY = now;
      } else {
        TARGET = TARGET - 0.5;
        OCCUPANCY = now - 1000*60*60*24; // set it to yesterday
      } 
    } 
  } catch (e) {
  }

  try {
    value = data.ZbReceived['0x8752'].Temperature;
    if (typeof value !== 'undefined' && value !== null) {
      client2.publish(MQTT2_USERNAME + '/feeds/zigbee.temperature', String(value));
      MEASURED = value;
    } 
  } catch (e) {
  }

  try {
    value = data.ZbReceived['0x8752'].Humidity;
    if (typeof value !== 'undefined' && value !== null) {
      client2.publish(MQTT2_USERNAME + '/feeds/zigbee.humidity', String(value));
      HUMIDITY = value;
    } 
  } catch (e) {
  }

  try {
    value = data.ZbReceived['0x4F42'].Occupancy;
    if (typeof value !== 'undefined' && value !== null) {
      client2.publish(MQTT2_USERNAME + '/feeds/zigbee.occupancy', String(value));
      if (value == 1) {
        OCCUPANCY = now;
      } 
    } 
  } catch (e) {
  }

  try {
    value = data.ZbReceived['0x5639'].click;
    if (typeof value !== 'undefined' && value !== null) {
      if (value == 'single') {
        OCCUPANCY = now;
      } else if (value == 'double') {
        OCCUPANCY = now - 1000*60*60*24; // set it to yesterday
      }
    } 
  } catch (e) {
  }

});

