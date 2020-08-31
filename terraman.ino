#include <Arduino.h>
#include <Wire.h>
// #include "SHT31.h"
#include <Adafruit_AM2315.h>
#include <multi_channel_relay.h>
#include "setpoints.h"
#include "PidController.h"

#define TCAADDR 0x70
#define SENSOR 0x44
#define LIGHT_CHANNEL 0x01
#define HEATING_CHANNEL_1 2
#define HEATING_CHANNEL_2 0x03
#define HEATING_CHANNEL_3 0x04
#define VENT_CHANNEL 0x08
#define MISTING_CHANNEL_1 0x05
#define MISTING_CHANNEL_2 0x06
#define MISTING_CHANNEL_3 0x07
#define SENSORS 0x03

Multi_Channel_Relay relay;

// SHT31 sht31_0 = SHT31();
// SHT31 sht31_1 = SHT31();
// SHT31 sht31_2 = SHT31();

Adafruit_AM2315 sensors[SENSORS];
double setPoints[SENSORS][2];


double samplePeriod = 2000;
 
unsigned long currentMistingTime, previousMistingTime, mistingDuration;
double input, output;

double safeTemperature = 28;
double safeHumidity = 60;

PidController pidControllers[3];

void tcaselect(uint8_t i) {
  if (i > 7) return;
 
  Wire.beginTransmission(TCAADDR);
  Wire.write(1 << i);
  Wire.endTransmission();  
}

void setup() {
    Serial.begin(9600);
    while(!Serial);
    Serial.println("begin...");
    for(int i = 0; i < SENSORS; i++) {
        tcaselect(i);
        sensors[i].begin();
    }

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
        received = waitForReply(0);
    }
    Serial.println("Waiting to enter loop.");
    delay(1000);
    Serial.println("Entering loop...");
}

void loop() {
    SetPoints setPoints = getSetpoints(0);
    int channels1[2] = {HEATING_CHANNEL_1, MISTING_CHANNEL_1};
    handleSensor(
        0,
        setPoints,
        channels1
    );
    setPoints = getSetpoints(1);
    int channels2[2] = {HEATING_CHANNEL_2, MISTING_CHANNEL_2};
    handleSensor(
        1,
        setPoints, 
        channels2
    );
    setPoints = getSetpoints(2);
    int channels3[2] = {HEATING_CHANNEL_3, MISTING_CHANNEL_3};
    handleSensor(
        2, 
        setPoints,
        channels3
    );
    uint8_t ventingRequired = getVentingRequirement();
    handleVenting(ventingRequired);
    delay(samplePeriod);
}

uint8_t getVentingRequirement() {

}

void handleVenting(uint8_t ventingRequired) {

}

SetPoints getSetpoints(int index) {
    Serial.println("REQ=SETPOINTS_" + index);
    String setPointReply = waitForReply(10000);
    char setPointReplyChars[setPointReply.length()] = setPointReply;
    struct SetPoints setPoints;
    if(setPointReply == "") {
        setPoints.temperature = safeTemperature;
        setPoints.humidity = safeHumidity;
    } else {
        char *token = strtok(setPointReplyChars, ";");
        setPoints.temperature = strtod(token, NULL);
        token = strtok(NULL, ";");
        setPoints.humidity = strtod(token, NULL);
    }
    return setPoints;
}

void handleSensor(int index, SetPoints setPoints, int channels[]) {
    float temp, hum;
    tcaselect(index);
    sensors[index].readTemperatureAndHumidity(&temp, &hum);
    double tempError = pidControllers[index](temp, setPoints.temperature);
    heat(tempError, channels[0]);
    //double humError = pidControllers[index](hum, setPoints.humidity);
    //mist(humError, channels[1]);
    outputStatus(index, temp, hum, channels[0], channels[1]);
}

void outputStatus(int sensor, double temp, double humidity, int heatingChannel, int mistingChannel) {
    //Send sensor info
    Serial.print("STATUS={");
    Serial.print("\"temp\": " + String(temp) + ","); 
    Serial.print("\"humidity\": " + String(humidity) + ",");
    Serial.print("\"heating\": " + String(bitRead(relay.getChannelState(), heatingChannel - 1)));
    Serial.print("\"misting\": " + String(bitRead(relay.getChannelState(), mistingChannel - 1)));
    Serial.print("}");
    Serial.println();
}

void heat(double error, int channel) {
    if(error > 0) {
        Serial.println("Turning channel on");
        relay.turn_on_channel(channel);
    } else {
        Serial.println("Turning channel off");
        relay.turn_off_channel(channel);
    }
}

void mist(double error, int channel) {

}


String waitForReply(long timeout) {
    String received = "";
    long start, current = millis();
    while(!Serial.available() && current - start <= timeout) {
        if(timeout > 0) {
            current = millis();
        }
        delay(3);
    }

    while (Serial.available()) {
        delay(3);
        if (Serial.available() > 0) {
            char c = Serial.read();
            received += c;
        }
    }
    return received;
} 
