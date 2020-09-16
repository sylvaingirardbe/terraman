#!/usr/bin/env python3

import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

powerpin = 6

GPIO.setup(powerpin, GPIO.OUT)
GPIO.output(powerpin, True)
GPIO.output(powerpin, False)
time.sleep(10.50)
GPIO.output(powerpin, True)
time.sleep(1.50)
GPIO.cleanup()