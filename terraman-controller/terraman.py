#!/usr/bin/env python3

# This example shows using two TSL2491 light sensors attached to TCA9548A channels 0 and 1.
# Use with other I2C sensors would be similar.
import time
import board
import busio
import adafruit_am2320
import adafruit_tca9548a

# Create I2C bus as normal
i2c = busio.I2C(board.SCL, board.SDA)

# Create the TCA9548A object and give it the I2C bus
tca = adafruit_tca9548a.TCA9548A(i2c)

# For each sensor, create it using the TCA9548A channel instead of the I2C object
am1 = adafruit_am2320.AM2320(tca[0])
am2 = adafruit_am2320.AM2320(tca[1])
am3 = adafruit_am2320.AM2320(tca[2])

# Loop and profit!
while True:
    print(am1.temperature, am1.relative_humidity)
    print(am2.temperature, am2.relative_humidity)
    print(am3.temperature, am3.relative_humidity)
    time.sleep(2)