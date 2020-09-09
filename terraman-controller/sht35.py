#!usr/bin/python
# modified for GroveWeatherPi to return CRC information
# SwitchDoc Labs, 2019
# added more reliablity functions including GrovePower Save

# COPYRIGHT 2016 Robert Wolterman
# MIT License, see LICENSE file for details

# MODULE IMPORTS
import time

import traceback
import RPi.GPIO as GPIO

from adafruit_bus_device.i2c_device import I2CDevice
GPIO.setmode(GPIO.BCM)

# GLOBAL VARIABLES
SHT35_I2CADDR = 0x45
SHT35_READREG = 0x24

SHT35DEBUG = True

def CRC(data):
    crc = 0xff
    for s in data:
        crc ^= s
        for _ in range(8):
            if crc & 0x80:
                crc <<= 1
                crc ^= 0x131
            else:
                crc <<= 1
    return crc

class SHT35:
    """Base functionality for SHT35 humidity and temperature sensor. """

    def __init__(self, i2c_bus, address=SHT35_I2CADDR, **kwargs):
        self._i2c = I2CDevice(i2c_bus, address)

        self.humidity = 0
        self.temperature = 0

    def read(self):
        # high repeatability, clock stretching disabled
        # self._i2c.write_i2c_block_data(self.address, SHT35_READREG, [0x00])
        result = bytearray(8)
        self._i2c.write(bytes([SHT35_READREG, 0x00]))

        # measurement duration < 16 ms
        time.sleep(0.016)

        # read 6 bytes back
        # Temp MSB, Temp LSB, Temp CRC, Humididty MSB, Humidity LSB, Humidity CRC
        self._i2c.readinto(result)

        if result[2] != CRC(result[:2]):
            raise ValueError("temperature CRC mismatch")
        if result[5] != CRC(result[3:5]):
            raise ValueError("humidity CRC mismatch")


        temperature = result[0] * 256 + result[1]
        celsius = -45 + (175 * temperature / 65535.0)
        humidity = 100 * (result[3] * 256 + result[4]) / 65535.0

        return celsius, humidity
