import wiringpi
import time
import os

pin = 0
wiringpi.wiringPiSetup()

# wiringpi.wiringPiSetupSys()
# os.system('gpio export 17 out')

wiringpi.digitalWrite(pin,1)
time.sleep(0.5);
wiringpi.digitalWrite(pin,0)
time.sleep(0.5);
wiringpi.digitalWrite(pin,1)
time.sleep(0.5);
wiringpi.digitalWrite(pin,0)
time.sleep(0.5);

pin = wiringpi.softPwmCreate(pin,0,100)

while True:
    for value in range(0,100):
        wiringpi.softPwmWrite(pin, value)
        print value
        time.sleep(0.01);
    for value in range(100,0,-1):
        wiringpi.softPwmWrite(pin, value)
        print value
        time.sleep(0.01);
