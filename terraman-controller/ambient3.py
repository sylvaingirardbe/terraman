#!/usr/bin/env python3

import time
import busio
import board
import adafruit_am2320

def CRC(data):
    crc = 0xff
    for s in data:
        crc ^= s
        for i in range(8):
            if crc & 0x80:
                crc <<= 1
                crc ^= 0x131
            else:
                crc <<= 1
    return crc


class GroveTemperatureHumiditySensorSHT3x(object):
    def __init__(self):
        bus = busio.I2C(board.SCL, board.SDA)
        self.am = adafruit_am2320.AM2320(bus)

    def read(self):
        return self.am.temperature, self.am.relative_humidity


def main():
    sensor = GroveTemperatureHumiditySensorSHT3x()
    while True:
        temperature, humidity = sensor.read()
        print('T1: {:.2f}C - RH1: {:.2f}'.format(temperature, humidity))

        time.sleep(2)


if __name__ == "__main__":
    main()
