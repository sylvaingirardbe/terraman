class Channel:
    """A channel represents the measurements from a sensor and the actions taken on it."""

    def __init__(self, index, temperatureSetpoint = 28, humiditySetpoint = 70):
        self.index = index
        self.humiditySetpoint = humiditySetpoint
        self.temperatureSetpoint = temperatureSetpoint
        self.humidity = 0
        self.temperature = 0
        self.heating = False
        self.misting = False
