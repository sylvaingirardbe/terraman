#!/usr/bin/env python3

import json
import time
import socketio
import controller

def main():
    sio = socketio.Client()
    terraController = controller.Controller()

    @sio.event
    def connect():
        print('Connection established')
        sio.emit('my other event', {'bleh': 'bleh'})

    def message(data):
        print('I received a message!')

    @sio.on('setpoints')
    def setpoints(data):
        index, humidity, temperature = json.load(data)
        terraController.updateSetpoints(index, humidity, temperature)

    @sio.on('enable lighting')
    def enableLighting():
        terraController.enableLighting()

    @sio.on('disable lighting')
    def disableLighting():
        terraController.disableLighting()

    @sio.on('my message')
    def my_message(data):
        print('message received with ', data)
        sio.emit('my response', {'response': 'my response'})

    @sio.event
    def disconnect():
        print('disconnected from server')

    try:
        sio.connect('http://localhost:3000')
    except:
        print('Unable to open socket')

    while True:
        terraController.readSensors()
        terraController.actOnSensors()
        jsonOutput = json.dumps(terraController.getChannelStates())
        print(jsonOutput)
        sio.emit('status', jsonOutput)
        time.sleep(1)

if __name__ == "__main__":
    main()