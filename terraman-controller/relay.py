from adafruit_bus_device.i2c_device import I2CDevice

RELAY_I2CADDR = 0x11
CHANNLE1_BIT = 0x01
CHANNLE2_BIT = 0x02
CHANNLE3_BIT = 0x04
CHANNLE4_BIT = 0x08
CHANNLE5_BIT = 0x10
CHANNLE6_BIT = 0x20
CHANNLE7_BIT = 0x40
CHANNLE8_BIT = 0x80
CMD_CHANNEL_CTRL = 0x10
CMD_SAVE_I2C_ADDR = 0x11
CMD_READ_I2C_ADDR = 0x12
CMD_READ_FIRMWARE_VER = 0x13

class Relay:
    def __init__(self, i2c_bus, address = 0x11, **kwargs):
        self.channelState = 0
        self._i2c = I2CDevice(i2c_bus, address)

    def getFirmwareVersion(self):
        self._i2c.write(bytes([CMD_READ_FIRMWARE_VER]))
        result = bytearray(1)
        self._i2c.readinto(result)
        return int.from_bytes(result)

    def changeI2CAddress(self, new_addr, old_addr):
        self._i2c.write(bytes([CMD_SAVE_I2C_ADDR]))
        self._i2c.write(bytes([new_addr]))
        self._i2c = I2CDevice(self._i2c.i2c, new_addr)

    def channelCtrl(self, state):
        self.channelState = state
        self._writeChannelState()

    def turnOnChannel(self, channel):
        self.channelState |= (1 << (channel - 1))
        self._writeChannelState()

    def turnOffChannel(self, channel):
        self.channelState &= ~(1 << (channel - 1))
        self._writeChannelState()

    def _writeChannelState(self):
        self._i2c.write(bytes([CMD_CHANNEL_CTRL]))
        self._i2c.write(bytes([self.channelState]))

    # def scanI2CDevice(self):
