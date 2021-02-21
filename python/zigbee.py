#!/usr/bin/env python3

# This Python script subscribes to MQTT messages from zigbee-bridge
# and sends a PushNotifier message

import os
import json
from pushnotifier import PushNotifier as pn
import paho.mqtt.client as mqtt

pn = pn.PushNotifier(os.environ['PUSH_USERNAME'], os.environ['PUSH_PASSWORD'], os.environ['PUSH_PACKAGE'], os.environ['PUSH_TOKEN'])
pd = pn.get_all_devices()

# my Tasmota zigbee-bridge sends MQTT updates on tele/zigbee/SENSOR
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("tele/zigbee/SENSOR/#")

# these are the devices linked to my Tasmota zigbee-bridge
Voordeur='0x5E30'
Zolder='0x4F42'
AquaraButton='0x5639'
TradfriButton='0x690F'
TemperatureHumidity='0x8752'

def on_message(client, userdata, msg):
    print(msg.topic)
    print(msg.payload)
    msg = json.loads(str(msg.payload.decode("utf-8","ignore")))
    # the messages have quite a variable content
    # sometimes it is the expected sensor value, sometimes only a status message
    try:
        value = msg['ZbReceived'][AquaraButton]['click']
        pn.send_text(value, devices=pd, silent=False)
    except:
        pass
    try:
        if msg['ZbReceived'][Voordeur]['Occupancy']:
            pn.send_text("Er is iemand bij de voordeur", devices=pd, silent=False)
    except:
        pass
    try:
        if msg['ZbReceived'][Zolder]['Occupancy']:
            pn.send_text("Er is iemand op zolder", devices=pd, silent=False)
    except:
        pass

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(os.environ['MQTT1_SERVER'][7:], int(os.environ['MQTT1_PORT']), 60)

client.loop_forever()
