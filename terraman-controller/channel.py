class Channel:
    """A channel represents the measurements from a sensor and the actions taken on it."""

    def __init__(self, index):
        self.index = index
        self.humidity = 0
        self.temperature = 0
        self.heating = False
        self.misting = False
