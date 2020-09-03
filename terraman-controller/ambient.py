#!/usr/bin/env python3

import smbus
import time
import busio
import adafruit_sgp30
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
    def __init__(self, address=0x45, ambientBus=None):
        self.address = address
        self.ambientBus = smbus.SMBus(1)
        qualityBus = busio.I2C(board.SCL, board.SDA, frequency=100000)
        self.sgp30 = adafruit_sgp30.Adafruit_SGP30(qualityBus)
        self.am = adafruit_am2320.AM2320(qualityBus)

    def read(self):
        # high repeatability, clock stretching disable
        self.ambientBus.write_i2c_block_data(self.address, 0x24, [0x00])
        # measurement duration < 16 ms
        time.sleep(0.016)
        # read 6 bytes back Temp MSB, Temp LSB, Temp CRC, Humididty MSB, Humidity LSB, Humidity CRC
        data = self.ambientBus.read_i2c_block_data(0x45, 0x00, 6)
        temperature = data[0] * 256 + data[1]
        celsius = -45 + (175 * temperature / 65535.0)
        humidity = 100 * (data[3] * 256 + data[4]) / 65535.0
        if data[2] != CRC(data[:2]):
            raise RuntimeError("temperature CRC mismatch")
        if data[5] != CRC(data[3:5]):
            raise RuntimeError("humidity CRC mismatch")
        eCO2, TVOC = self.sgp30.iaq_measure()
        return celsius, humidity, eCO2, TVOC, self.am.temperature, self.am.relative_humidity


def main():
    sensor = GroveTemperatureHumiditySensorSHT3x()
    while True:
        temperature, humidity, eCO2, TVOC, temperature2, humidity2 = sensor.read()
        print('T1: {:.2f}C - RH1: {:.2f}'.format(temperature, humidity))
        print('T2: {:.2f}C - RH2: {:.2f}'.format(temperature2, humidity2))
        print("eCO2 = %d ppm \t TVOC = %d ppb" % (eCO2, TVOC))

        time.sleep(1)


if __name__ == "__main__":
    main()
