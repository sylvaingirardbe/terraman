#!/usr/bin/env python3

import time
import board
import busio
import adafruit_tca9548a
# import sht35
import adafruit_sht31d

def main():
    # Create I2C bus as normal
    i2c = busio.I2C(board.SCL, board.SDA)

    # Create the TCA9548A object and give it the I2C bus
    tca = adafruit_tca9548a.TCA9548A(i2c)

    # For each sensor, create it using the TCA9548A channel instead of the I2C object
    # am1 = sht35.SHT35(tca[0])
    sensor = adafruit_sht31d.SHT31D(tca[0], 0x45)
    # am2 = AM2315.AM2315(tca[1], powerpin=6)

    # Loop and profit!
    while True:
        # print("H,T ", am1.read())
        # print("H,T ", am2.read_humidity_temperature())
        print(sensor.temperature)
        print(sensor.relative_humidity)
        time.sleep(2)

if __name__ == "__main__":
    main()