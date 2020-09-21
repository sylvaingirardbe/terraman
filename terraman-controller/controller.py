import channel
import pid
import relay
import board
import busio
import adafruit_sht31d
import adafruit_tca9548a

class Controller:
    """Maintains the state of all the channels"""
    bindings = {
        "1_heating": 1,
        "1_misting": 2,
        "2_heating": 3,
        "lighting": 4
    }
    i2c = busio.I2C(board.SCL, board.SDA)
    tca = adafruit_tca9548a.TCA9548A(i2c)
    relayController = relay.Relay()
    sensors = [
        adafruit_sht31d.SHT31D(tca[0], 0x44),
        adafruit_sht31d.SHT31D(tca[1], 0x44)
        # adafruit_sht31d.SHT31D(tca[2], 0x44),
        # adafruit_sht31d.SHT31D(tca[3], 0x44)
    ]
    
    def __init__(self, p=0.2, i=0.2, d=0, **kwargs):
        self.channels = [
            channel.Channel(0, pid.PID(p, i, d)),
            channel.Channel(1, pid.PID(p, i, d)),
            channel.Channel(2, pid.PID(p, i, d)),
            channel.Channel(3, pid.PID(p, i, d))
        ]

    def updateMeasurements(self, index, temperature, humidity):
        self.channels[index].updateMeasurements(temperature, humidity)

    def updateSetpoints(self, index, temperatureSetpoint, humiditySetpoint):
        self.channels[index].updateSetpoints(temperatureSetpoint, humiditySetpoint)

    def getChannelState(self, index):
        return index, self.channels[index].getState()

    def enableLighting(self):
        self.relayController.turnOnChannel(self.bindings['lighting'])

    def disableLighting(self):
        self.relayController.turnOffChannel(self.bindings['lighting'])

    def readSensors(self):
        for i in range(0, len(self.sensors)):
            self.updateMeasurements(i, self.sensors[i].temperature, self.sensors[i].relative_humidity)

    def actOnSensors(self):
        for i in range(0, 4):
            if '{}_heating'.format(i) in self.bindings:
                self.relayController.turnOnChannel(self.bindings['{}_heating'.format(i)]) if self.channels[i].heating else self.relayController.turnOffChannel(self.bindings['{}_heating'.format(i)])
            if '{}_misting'.format(i) in self.bindings:
                self.relayController.turnOnChannel(self.bindings['{}_misting'.format(i)]) if self.channels[i].misting else self.relayController.turnOffChannel(self.bindings['{}_misting'.format(i)])
    
    def getChannelStates(self):
        states = []
        for i in range(0, len(self.sensors)):
            states.append(self.getChannelState(i))
        return states