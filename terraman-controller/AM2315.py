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
AM2315_I2CADDR = 0x5C
AM2315_READREG = 0x03
MAXREADATTEMPT = 10

AM2315DEBUG = True


class AM2315:
    """Base functionality for AM2315 humidity and temperature sensor. """

    def __init__(self, i2c_bus, address=AM2315_I2CADDR, powerpin=0, **kwargs):
        self.powerpin = powerpin
        # for Grove PowerSave
        if (self.powerpin != 0):
            GPIO.setup(self.powerpin, GPIO.OUT)
            GPIO.output(self.powerpin, True)
            time.sleep(1.0)

        self._i2c = I2CDevice(i2c_bus, address)

        self.humidity = 0
        self.temperature = 0
        self.crc = 0
        self.AM2315PreviousTemp = -1000
        self.goodreads = 0
        self.badreadings = 0
        self.badcrcs = 0
        self.retrys = 0
        self.powercycles = 0

    def powerCycleAM2315(self):
        if (AM2315DEBUG == True):
            print("power cycling AM2315")
        GPIO.output(self.powerpin, False)
        time.sleep(10.50)
        GPIO.output(self.powerpin, True)
        time.sleep(1.50)
        self.powercycles += 1

    def verify_crc(self, char):
        """Returns the 16-bit CRC of sensor data"""
        crc = 0xFFFF
        for l in char:
            crc = crc ^ l
            for i in range(1, 9):
                if(crc & 0x01):
                    crc = crc >> 1
                    crc = crc ^ 0xA001
                else:
                    crc = crc >> 1
        return crc

    # fast read for device detection without faults
    def _fast_read_data(self):

        # WAKE UP
        try:
            self._i2c.write(bytes([0x00]))
            time.sleep(0.050)
        except:
            self._i2c.write(bytes([0x00]))
            time.sleep(0.050)

        # TELL THE DEVICE WE WANT 4 BYTES OF DATA
        self._i2c.write(bytes([AM2315_READREG, 0x00 & 0xFF, 0x04]))

        time.sleep(0.050)
        result = bytearray(0x04 + 4)  # 2 bytes pre, 2 bytes crc
        self._i2c.readinto(result)
        print(' '.join(map(str, result)))

        self.temperature = (((result[4] & 0x7F) << 8) | result[5]) / 10.0
        self.humidity = ((result[2] << 8) | result[3]) / 10.0

        self.crc = ((result[7] << 8) | result[6])
        # Verify CRC here
        # force CRC error with the next line
        #tmp[0] = tmp[0]+1
        t = bytearray([result[0], result[1], result[2], result[3], result[4], result[5]])
        c = self.verify_crc(t)

        if (self.crc != c) or (c == 0):
            # if (self.crc != c):
            if (AM2315DEBUG == True):
                print("AM2314 BAD CRC")
            self.crc = -1
        else:

            if (AM2315DEBUG == True):
                print("Fast Read AM2315temperature=", self.temperature)
                print("Fast Read AM2315humdity=", self.humidity)
                print("Fast Read AM2315crc=", self.crc)
                print("Fast Read AM2315c=", c)

    def _read_data(self):
        count = 0
        tmp = None
        powercyclecount = 0
        while count <= MAXREADATTEMPT:
            try:
                try:
                    if (AM2315DEBUG == True):
                        print("Try to wake up")
                    self._i2c.write(bytes([0x00 & 0xFF]))
                    time.sleep(0.050)
                except:
                    if (AM2315DEBUG == True):
                        print("Wake Byte Fail")
                    time.sleep(1.000)
                    if (AM2315DEBUG == True):
                        print("Trying to wake after fail")
                    self._i2c.write(bytes([0x00 & 0xFF]))
                    time.sleep(0.051)

                # TELL THE DEVICE WE WANT 4 BYTES OF DATA
                self._i2c.write(bytes([AM2315_READREG, 0x00 & 0xFF, 0x04]))
                time.sleep(0.09)
                tmp = bytearray(0x04 + 4)  # 2 bytes pre, 2 bytes crc
                self._i2c.readinto(tmp)
                self.temperature = (((tmp[4] & 0x7F) << 8) | tmp[5]) / 10.0
                self.humidity = ((tmp[2] << 8) | tmp[3]) / 10.0
                # check for > 10.0 degrees higher
                if (self.AM2315PreviousTemp != -1000):   # ignore first time
                    if (self.humidity < 0.01 or self.humidity > 100.0):
                        # OK, humidity is bad.  Ignore
                        if (AM2315DEBUG == True):
                            print(">>>>>>>>>>>>>")
                            print("Bad AM2315 Humidity = ", self.temperature)
                            print(">>>>>>>>>>>>>")
                            self.badreadings = self.badreadings+1
                            tmp = None
                    else:
                        if (abs(self.temperature - self.AM2315PreviousTemp) > 10.0):
                            # OK, temp is bad.  Ignore
                            if (AM2315DEBUG == True):
                                print(">>>>>>>>>>>>>")
                                print("Bad AM2315 Temperature = ", self.temperature)
                                print(">>>>>>>>>>>>>")
                                self.badreadings = self.badreadings+1
                                tmp = None
                        else:
                            # Good Temperature
                            self.AM2315PreviousTemp = self.temperature
                else:
                    # assume first is good temperature
                    self.AM2315PreviousTemp = self.temperature
                # IF WE HAVE DATA, LETS EXIT THIS LOOP
                if tmp != None:
                    break
            except Exception as ex:
                if (AM2315DEBUG == True):
                    template = "An exception of type {0} occurred. Arguments:\n{1!r}"
                    message = template.format(type(ex).__name__, ex.args)
                    print(message)
                    # print traceback.format_exc()
                    print("AM2315readCount = ", count)
            count += 1
            self.retrys += 1
            time.sleep(0.10)
            # only do three power cycle attempts
            if (self.powerpin != 0):
                if (count > MAXREADATTEMPT):
                    self.powerCycleAM2315()
                    if (powercyclecount <= 2):
                        powercyclecount + 1
                        count = 0

        if (AM2315DEBUG == True):
            print("--->looking at good data")

        # GET THE DATA OUT OF THE LIST WE READ
        self.humidity = ((tmp[2] << 8) | tmp[3]) / 10.0
        self.temperature = (((tmp[4] & 0x7F) << 8) | tmp[5]) / 10.0
        if (tmp[4] & 0x80):
            self.temperature = -self.temperature

        self.crc = ((tmp[7] << 8) | tmp[6])
        # Verify CRC here
        # force CRC error with the next line
        #tmp[0] = tmp[0]+1
        t = bytearray([tmp[0], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5]])
        c = self.verify_crc(t)

        if (AM2315DEBUG == True):
            print("AM2315temperature=", self.temperature)
            print("AM2315humdity=", self.humidity)
            print("AM2315crc=", self.crc)
            print("AM2315c=", c)

        if (self.crc != c) or (c == 0):
            # if self.crc != c:
            if (AM2315DEBUG == True):
                print("AM2314 BAD CRC")
            self.badcrcs = self.badcrcs + 1
            self.crc = -1
        else:
            self.goodreads = self.goodreads+1

    def fast_read_temperature(self):
        self._fast_read_data()
        return self.temperature

    def read_temperature(self):
        self._read_data()
        return self.temperature

    def read_humidity(self):
        self._read_data()
        return self.humidity

    def read_humidity_temperature(self):
        self._read_data()
        return (self.humidity, self.temperature)

    def read_humidity_temperature_crc(self):
        self._read_data()
        return (self.humidity, self.temperature, self.crc)

    def fast_read_humidity_temperature_crc(self):
        self._fast_read_data()
        return (self.humidity, self.temperature, self.crc)

    def read_status_info(self):
        return (self.goodreads, self.badreadings, self.badcrcs, self.retrys, self.powercycles)


# if __name__ == "__main__":
#     am2315 = AM2315()
#     print(am2315.read_temperature())
#     print(am2315.read_humidity())
#     print(am2315.read_humidity_temperature())
#     print(am2315.read_humidity_temperature_crc())
