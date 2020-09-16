#!/usr/bin/env python3

import relay
import busio
import time
import board

i2c = busio.I2C(board.SCL, board.SDA)
relayController = relay.Relay(i2c)
relayController.changeI2CAddress(0x11, 0x11)
# relayController.turnOnChannel(1)
# relayController.turnOnChannel(4)
# print(relayController.channelState)
# print(relayController.getFirmwareVersion())
# time.sleep(2)
# relayController.turnOffChannel(1)
