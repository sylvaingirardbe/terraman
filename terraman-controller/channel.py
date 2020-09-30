import pid

class Channel:
    """A channel represents the measurements from a sensor and the actions taken on it."""

    def __init__(self, index, pid: pid.PID, temperatureSetpoint = 28, humiditySetpoint = 70):
        self.index = index
        self.humiditySetpoint = humiditySetpoint
        self.temperatureSetpoint = temperatureSetpoint
        self.humidity = 0
        self.temperature = 0
        self.heating = False
        self.misting = False
        self.pid = pid
        self.pid.setSampleTime(1)
        self.pid.SetPoint = temperatureSetpoint
    
    def updateHumiditySetpoint(self, humiditySetpoint):
        if not humiditySetpoint == None and not self.humiditySetpoint == humiditySetpoint: 
            self.humiditySetpoint = humiditySetpoint
           
    def updateTemperatureSetpoint(self, temperatureSetpoint):
        if not temperatureSetpoint == None and not self.temperatureSetpoint == temperatureSetpoint: 
            self.temperatureSetpoint = temperatureSetpoint
            self.pid.SetPoint = temperatureSetpoint
            self.pid.update(self.temperature)

    def updateSetpoints(self, temperatureSetpoint, humiditySetpoint):
            self.updateHumiditySetpoint(humiditySetpoint)
            self.updateTemperatureSetpoint(temperatureSetpoint)
            self.__actOnError()

    def updateMeasurements(self, temperature, humidity):
        self.humidity = humidity
        self.temperature = temperature
        self.pid.update(self.temperature)
        self.__actOnError()

    def __actOnError(self):
        self.heating = self.pid.last_error > 0
        self.misting = (self.humiditySetpoint - self.humidity > 10) and not self.misting or (self.humiditySetpoint - self.humidity > -10) and self.misting
                            # 70            -          70                        False             70             -         70                      False False
                            # 70            -          70                        True              70             -         70                      True  True
                            # 70            -          81                        True              70             -         81                      True  False
                            # 70            -          59                        True              70             -         59                      True  True

    def getAcuations(self):
        return self.heating, self.misting

    def getState(self):
        return self.temperature, self.heating, self.humidity, self.misting
