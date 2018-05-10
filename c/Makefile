all: status_led_red status_led_green status_led_blue status_led_white status_led_black status_led_yellow status_led_mangenta status_led_cyan

status_led_red: status_led.c 
	gcc -o $@ status_led.c -DRED=HIGH -DGREEN=LOW -DBLUE=LOW -lwiringPi

status_led_green: status_led.c 
	gcc -o $@ status_led.c -DRED=LOW -DGREEN=HIGH -DBLUE=LOW -lwiringPi

status_led_blue: status_led.c 
	gcc -o $@ status_led.c -DRED=LOW -DGREEN=LOW -DBLUE=HIGH -lwiringPi

status_led_white: status_led.c 
	gcc -o $@ status_led.c -DRED=HIGH -DGREEN=HIGH -DBLUE=HIGH -lwiringPi

status_led_black: status_led.c 
	gcc -o $@ status_led.c -DRED=LOW -DGREEN=LOW -DBLUE=LOW -lwiringPi

status_led_yellow: status_led.c 
	gcc -o $@ status_led.c -DRED=HIGH -DGREEN=HIGH -DBLUE=LOW -lwiringPi

status_led_mangenta: status_led.c 
	gcc -o $@ status_led.c -DRED=HIGH -DGREEN=LOW -DBLUE=HIGH -lwiringPi

status_led_cyan: status_led.c 
	gcc -o $@ status_led.c -DRED=LOW -DGREEN=HIGH -DBLUE=HIGH -lwiringPi

