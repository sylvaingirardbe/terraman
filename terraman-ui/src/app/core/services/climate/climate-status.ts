import { SetPoint } from './set-point';

export interface ClimateStatus {
    index: number;
    temp: number;
    humidity: number;
    setPoint: SetPoint;
    heating: boolean;
    misting: boolean;
}