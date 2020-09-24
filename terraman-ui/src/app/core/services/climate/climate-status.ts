export interface ClimateStatus {
    index: number;
    temp: number;
    humidity: number;
    temperatureSetpoint: number;
    humiditySetpoint: number;
    heating: boolean;
    misting: boolean;
}