import { SetPoint } from '../../core/services/climate/set-point';
import { ClimateStatus } from '../../core/services/climate/climate-status';

export interface Sensor {
    status: ClimateStatus;
    setPoint: SetPoint;
}