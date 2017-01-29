import wiringpi
import time

wiringpi.wiringPiSetup()

wiringpi.pinMode(0,1)

while True:
    time.sleep(0.5)
    wiringpi.digitalWrite(0,1)
    time.sleep(0.5)
    wiringpi.digitalWrite(0,0)
  
