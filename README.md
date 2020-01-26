This directory contains some experimental code for the Raspberry Pi. The code mainly has to do with home automation and domotica. More details can be found on http://robertoostenveld.nl/category/raspberry-pi/

Although implemented for Raspberry Pi, the nodejs code also works fine on macOS. To set up port forwarding on El Captain and Sierra, see http://apple.stackexchange.com/questions/230300/what-is-the-modern-way-to-do-port-forwarding-on-el-capitan-forward-port-80-to

```bash
echo "rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 3000" | sudo pfctl -ef -
sudo pfctl -s nat
```

