#include <Arduino.h>
#include <Wire.h>
#include "SHT31.h"
#include <multi_channel_relay.h>

#define SENSOR 0x44;
#define USE_8_CHANNELS (1)
 
Multi_Channel_Relay relay;

SHT31 sht31 = SHT31();

unsigned long currentTime, previousTime;
double elapsedTime;
double lastError;

void setup() {
    Serial.begin(9600);
    while(!Serial);
    Serial.println("begin...");  
    sht31.begin();

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

    double out = pid(temp, setPoint);
    Serial.println("Error: " + String(out));

    //Send sensor info
    Serial.print("{");
    Serial.print("\"temp\": " + String(temp) + ","); 
    Serial.print("\"humidity\": " + String(hum)); 
    Serial.print("}");
    Serial.println();
    delay(1000);
}

double pid(double value, double setPoint){    
    double kp = 2;
    double ki = 5;
    double kd = 1;
    double error;
    double cumError, rateError;

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
