#include <Arduino.h>
#include <Wire.h>
#include "SHT31.h"
#include <multi_channel_relay.h>

#define SENSOR 0x44
#define USE_8_CHANNELS (1)
#define LIGHT_CHANNEL 0x01
#define HEATING_CHANNEL 0x02
#define VENT_CHANNEL 0x03
#define MIST_CHANNEL 0x04
 
Multi_Channel_Relay relay;

SHT31 sht31 = SHT31();

double kp = 1;
double ki = 0;
double kd = 0;

double samplePeriod = 1000;
 
unsigned long currentTime, previousTime;
double elapsedTime;
double error;
double lastError;
double input, output;
double cumError, rateError;

void setup() {
    Serial.begin(9600);
    while(!Serial);
    Serial.println("begin...");  
    sht31.begin();

    // uint8_t old_address = relay.scanI2CDevice();
    // if((0x00 == old_address) || (0xff == old_address)) {
    //     while(1);
    // }

    // Serial.println("Old address: " + String(old_address));

    Serial.println("Start write address");
    relay.changeI2CAddress(0x11, 0x11);  /* Set I2C address and save to Flash */  
    Serial.println("End write address");

      /* Read firmware  version */
    Serial.print("firmware version: ");
    Serial.print("0x");
    Serial.print(relay.getFirmwareVersion(), HEX);
    Serial.println();

    Serial.println("HI TERRAMAN");
    String received = ""; 
    //Wait for serial connection to controller
    while(received != "HI TERRAMAN\n") {
        received = waitForReply();
    }
}

void loop() {
    //Read setpoint
    Serial.println("REQ: SETPOINT");
    double setPoint = 0;
    while(setPoint <= 0) {
        setPoint = waitForReply().toDouble();
    }

    double temp = sht31.getTemperature();
    double hum = sht31.getHumidity();

    double error = pid(temp, setPoint);
    Serial.println("Error: " + String(error));

    actOnError(error);

    outputStatus(temp, hum);
    delay(samplePeriod);
}

void outputStatus(double temp, double humidity) {
    //Send sensor info
    Serial.print("{");
    Serial.print("\"temp\": " + String(temp) + ","); 
    Serial.print("\"humidity\": " + String(humidity) + ",");
    Serial.print("\"heating\": " + String(bitRead(relay.getChannelState(), HEATING_CHANNEL - 1)));
    Serial.print("}");
    Serial.println();

}

void actOnError(double error) {
    if(error > 0) {
        Serial.println("Turning heating on");
        relay.turn_on_channel(HEATING_CHANNEL);
    } else {
        Serial.println("Turning heating off");
        relay.turn_off_channel(HEATING_CHANNEL);
    }
}

double p(double value, double setPoint) {
    error = value - setPoint;
}

double pid(double value, double setPoint){    
    currentTime = millis();
    elapsedTime = (double)(currentTime - previousTime);
    
    error = setPoint - value;
    cumError += error * elapsedTime;
    rateError = (error - lastError)/elapsedTime;

    double out = kp*error + ki*cumError + kd*rateError;

    lastError = error;
    previousTime = currentTime;

    return out;
}

String waitForReply() {
    String received;
    while (Serial.available()) {
        delay(3);
        if (Serial.available() >0) {
            char c = Serial.read();
            received += c;
        }
    }
    return received;
} 
