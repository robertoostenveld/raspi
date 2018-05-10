import wiringpi
import time

pin=3

wiringpi.wiringPiSetup()

wiringpi.pinMode(pin,1)

while True:
    time.sleep(0.5)
    wiringpi.digitalWrite(pin,1)
    time.sleep(0.5)
    wiringpi.digitalWrite(pin,0)
  
