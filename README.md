This directory contains some experimental code for the Raspberry Pi. The code mainly has to do with home automation and domotica. More details can be found on http://robertoostenveld.nl/category/raspberry-pi/


## 12V trigger for NAD-D3020 amplifier

The `node/versterker.js` script implements a small application to switch my NAD-D3020 amplifier on and off by means of a 12V trigger.

This application detects whether my smart TV and/or Mac mini are switched on. If either one is switched on, the amplifier gets switched on. If both TV and Mac mini are switched off, the amplifier gets switched off.

See https://robertoostenveld.nl/12-volt-trigger-for-nad-d3020-amplifier/


## Switch PWM fan based on humidity sensor

The `node/badkamer-ventilator.js` script implements a small application that switches and controls the speed of a Ruck ETAMASTER EC tube fan in my bathroom. It uses an ESP8266-based PWM controller, in combination with a BME280 humidity sensor implemented with another ESP8266. Both are using Tasmota firmware.


## macOS

Although implemented for Raspberry Pi, the nodejs code also works fine on macOS. To set up port forwarding on El Captain and Sierra, see http://apple.stackexchange.com/questions/230300/what-is-the-modern-way-to-do-port-forwarding-on-el-capitan-forward-port-80-to

```bash
echo "rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 3000" | sudo pfctl -ef -
sudo pfctl -s nat
```

