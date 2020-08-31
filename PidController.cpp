#include <Arduino.h>
#include "PidController.h"

double PidController::pid(double value, double setPoint) {
    currentTime = millis();
    elapsedTime = (double)(currentTime - previousTime);
    
    error = setPoint - value;
    cummulativeError += error * elapsedTime;
    rateError = (error - lastError)/elapsedTime;

    double out = kp * error + ki * cummulativeError + kd * rateError;

    lastError = error;
    previousTime = currentTime;

    return out;
}