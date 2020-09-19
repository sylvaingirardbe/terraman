from gpiozero import DigitalOutputDevice

class Relay:
    def __init__(self, **kwargs):
        self.channels = [
            DigitalOutputDevice(17),
            DigitalOutputDevice(27),
            DigitalOutputDevice(22),
            DigitalOutputDevice(23),
            DigitalOutputDevice(24),
            DigitalOutputDevice(25),
            DigitalOutputDevice(5),
            DigitalOutputDevice(6)
        ]

    def turnOnChannel(self, channel):
        self.channels[channel].on()

    def turnOffChannel(self, channel):
        self.channels[channel].off()
