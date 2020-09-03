#!/usr/bin/env python3

import time
import board
import busio
import AM2315
import traceback

# create the I2C shared bus
i2c = busio.I2C(board.SCL, board.SDA)
am = AM2315.AM2315(i2c, powerpin=6)

# def verify_crc(self, char):
#      """Returns the 16-bit CRC of sensor data"""
#       crc = 0xFFFF
#        for l in char:
#             crc = crc ^ l
#             for i in range(1, 9):
#                 if(crc & 0x01):
#                     crc = crc >> 1
#                     crc = crc ^ 0xA001
#                 else:
#                     crc = crc >> 1
#         return crc

# while True:
#     print("Temperature: ", am.temperature)
#     print("Humidity: ", am.relative_humidity)
#     time.sleep(2)

while (1):
    '''
    try:    
        outsideHumidity, outsideTemperature, crc_check =thsen.fast_read_humidity_temperature_crc()
        print "FROT=", outsideTemperature
        print "FROH=", outsideHumidity
        print "FROCRC=", crc_check 
    except:
        traceback.print_exc()
        print "bad AM2315 read"
    '''
    print("T   ", am.read_temperature())
    print("H   ", am.read_humidity())
    print("H,T ", am.read_humidity_temperature())
    print("H,T,C ", am.read_humidity_temperature_crc())
    c = am.read_humidity_temperature_crc()
    print("AM2315 Stats: (g,br,bc,rt,pc)", am.read_status_info())

    time.sleep(2.0)
