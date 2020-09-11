#!/usr/bin/env python3

import time
import board
import busio
import adafruit_tca9548a
import adafruit_sht31d

def main():
    i2c = busio.I2C(board.SCL, board.SDA)
    tca = adafruit_tca9548a.TCA9548A(i2c)

    sensor1 = adafruit_sht31d.SHT31D(tca[0], 0x44)
    sensor2 = adafruit_sht31d.SHT31D(tca[1], 0x44)
    while True:
        print(sensor1.temperature, sensor1.relative_humidity)
        print(sensor2.temperature, sensor2.relative_humidity)
        time.sleep(2)

if __name__ == "__main__":
    main()