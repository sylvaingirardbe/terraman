import channel
import pid

class Controller:
    """Maintains the state of all the channels"""

    def __init__(self, p=0.2, i=0.2, d=0, **kwargs):
        self.channels = [
            channel.Channel(0),
            channel.Channel(1),
            channel.Channel(2),
            channel.Channel(3)
        ]
        self.pidControllers = [
            pid.PID(p, i, d),
            pid.PID(p, i, d),
            pid.PID(p, i, d),
            pid.PID(p, i, d)
        ]
        for i in range(0, 4):
            self.pidControllers[i].SetPoint = self.channels[i].temperatureSetpoint
            self.pidControllers[i].setSampleTime(1)

    def updateChannel(self, index, temperature, humidity):
        self.channels[index].temperature = temperature
        self.channels[index].humidity = humidity
    
    def getChannelState(self, index):
        return self.channels[index]
    
    def actOnStatus(self):
        for i in range(0, 4):
            self.pidControllers[i].update(self.channels[i].temperature) 
            print(i, self.pidControllers[i].last_error)
            self.channels[i].heating = self.pidControllers[i].last_error > 0
            self.channels[i].misting = (self.channels[i].humiditySetpoint - self.channels[i].humidity > 10) and not self.channels[i].misting or (self.channels[i].humiditySetpoint - self.channels[i].humidity > -10) and self.channels[i].misting
