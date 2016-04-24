import wiringpi
import time
import os

pinR = 17
pinG = 18
pinB = 22

os.system('gpio export ' + str(pinR) + ' out')
os.system('gpio export ' + str(pinG) + ' out')
os.system('gpio export ' + str(pinB) + ' out')

wiringpi.wiringPiSetupSys()
wiringpi.pinMode(pinR,wiringpi.OUTPUT)
wiringpi.pinMode(pinG,wiringpi.OUTPUT)
wiringpi.pinMode(pinB,wiringpi.OUTPUT)

while True:
    time.sleep(0.5)
    wiringpi.digitalWrite(pinR,1)
    time.sleep(0.5)
    wiringpi.digitalWrite(pinG,1)
    time.sleep(0.5)
    wiringpi.digitalWrite(pinB,1)

    time.sleep(0.5)
    wiringpi.digitalWrite(pinR,0)
    time.sleep(0.5)
    wiringpi.digitalWrite(pinG,0)
    time.sleep(0.5)
    wiringpi.digitalWrite(pinB,0)
  
