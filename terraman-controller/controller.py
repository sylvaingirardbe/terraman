import channel
import pid

class Controller:
    """Maintains the state of all the channels"""

    def __init__(self, **kwargs):
        self.channels = [
            channel.Channel(1),
            channel.Channel(2),
            channel.Channel(3),
            channel.Channel(4)
        ]
    def updateChannel(self, index, temperature, humidity):
        self.channels[index].temperature = temperature
        self.channels[index].humidity = humidity
    
    def getChannelState(self, index):
        return self.channels[index]