#include <wiringPi.h>

#define pinR 0
#define pinG 2
#define pinB 3

int main (void)
{
  wiringPiSetup () ;
  pinMode (pinR, OUTPUT) ;
  pinMode (pinG, OUTPUT) ;
  pinMode (pinB, OUTPUT) ;
  digitalWrite (pinR, RED);
  digitalWrite (pinG, GREEN);
  digitalWrite (pinB, BLUE);
  return 0 ;
}
