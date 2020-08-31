class PidController {
    private:
        unsigned long currentTime;
        unsigned long previousTime;
        unsigned long elapsedTime;
        double error;
        double cummulativeError;
        double rateError;
        double lastError;
        double kp = 1;
        double ki = 0;
        double kd = 0;

    public:
        double pid(double value, double setPoint);
};
