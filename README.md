# Terraman

This is the code for a terrarium management system. A bunch of sensors and relays hooked to an Arduino to keep a terrarium at a set climate. 

The setpoints and actuation on the Arduino is controlled by a UI on Raspberry Pi. It supports monitoring, logging and scheduling of the climate.

# Hardware requirements

The software is developed and tested on:
- Arduino Uno 
- Seeed Studio Grove Base Shield V2
- TCA9548A I2C Multiplexer
- Multiple Seeed Studio Grove - I2C High Accuracy Temp&Humi Sensors
- Multiple Seeed Studio Grove - I2C High Accuracy Temperature Sensors
- Seeed Studio Grove - 8-Channel Solid State Relay
- Raspberry Pi 4
- 7" touchscreen for Raspberry Pi

The multiplexer is only required if you intend to attach more than 2 temperature & humidity sensors since they only have 2 user selectable I2C addresses.
