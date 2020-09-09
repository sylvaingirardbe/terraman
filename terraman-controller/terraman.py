#!/usr/bin/env python3

import time
# import board
# import busio
# import adafruit_sht31d
# import adafruit_tca9548a
import socketio

# i2c = busio.I2C(board.SCL, board.SDA)
# tca = adafruit_tca9548a.TCA9548A(i2c)
# sensor1 = adafruit_sht31d.SHT31D(tca[0], 0x45)
# sensor2 = adafruit_sht31d.SHT31D(tca[1], 0x45)
# sensor3 = adafruit_sht31d.SHT31D(tca[2], 0x45)
# sensor4 = adafruit_sht31d.SHT31D(tca[3], 0x45)

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')
    sio.emit('my other event', {'bleh': 'bleh'})

def message(data):
    print('I received a message!')

@sio.on('my message')
def my_message(data):
    print('message received with ', data)
    sio.emit('my response', {'response': 'my response'})

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:3000')

# while True:
#     print(sensor1.temperature, sensor1.relative_humidity)
#     print(sensor2.temperature, sensor2.relative_humidity)
#     print(sensor3.temperature, sensor3.relative_humidity)
#     print(sensor4.temperature, sensor4.relative_humidity)
#     time.sleep(1)

sio.wait()
