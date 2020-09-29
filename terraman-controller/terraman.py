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
        print(data)
        terraController.updateSetpoints(data['index'], data['temperature'], data['humidity'])

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
        sio.connect('http://192.168.1.128:3000')
    except:
        print('Unable to open socket. Retrying in 5 seconds...')
        time.sleep(5)
        main()

    while True:
        try:
            for i in range(0, len(terraController.channels)):
                sio.emit('request setpoints', i)
            terraController.readSensors()
            terraController.actOnSensors()
            jsonOutput = json.dumps(terraController.getChannelStates())
            sio.emit('status', jsonOutput)
            time.sleep(1)
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()
