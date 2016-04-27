#!/usr/bin/env python

import time
import ConfigParser
import redis
import sys
import os
import threading
import mido
import wiringpi

if hasattr(sys, 'frozen'):
    basis = sys.executable
elif sys.argv[0]!='':
    basis = sys.argv[0]
else:
    basis = './'
installed_folder = os.path.split(basis)[0]

# eegsynth/lib contains shared modules
sys.path.insert(0,'/home/pi/eegsynth/lib')
import EEGsynth

config = ConfigParser.ConfigParser()
config.read(os.path.join(installed_folder, os.path.splitext(os.path.basename(__file__))[0] + '.ini'))

# this determines how much debugging information gets printed
debug = config.getint('general', 'debug')

try:
    r = redis.StrictRedis(host=config.get('redis','hostname'), port=config.getint('redis','port'), db=0)
    response = r.client_list()
    if debug>0:
        print "Connected to redis server"
except redis.ConnectionError:
    print "Error: cannot connect to redis server"
    exit()

# wiringpi.wiringPiSetup()
wiringpi.wiringPiSetupGpio()

pinR = config.getint('output', 'red')
pinG = config.getint('output', 'green')
pinB = config.getint('output', 'blue')

wiringpi.pinMode(pinR, wiringpi.OUTPUT)
wiringpi.pinMode(pinG, wiringpi.OUTPUT)
wiringpi.pinMode(pinB, wiringpi.OUTPUT)

wiringpi.softPwmCreate(pinR, 0, 127)
wiringpi.softPwmCreate(pinG, 0, 127)
wiringpi.softPwmCreate(pinB, 0, 127)

while True:
    time.sleep(config.getfloat('general', 'delay'))

    valR = EEGsynth.getint('input', 'red',   config, r) * EEGsynth.getfloat('scaling', 'red',   config, r)
    valG = EEGsynth.getint('input', 'green', config, r) * EEGsynth.getfloat('scaling', 'green', config, r)
    valB = EEGsynth.getint('input', 'blue',  config, r) * EEGsynth.getfloat('scaling', 'blue',  config, r)

    print valR, valG, valB

    wiringpi.softPwmWrite(pinR, int(valR))
    wiringpi.softPwmWrite(pinG, int(valG))
    wiringpi.softPwmWrite(pinB, int(valB))

