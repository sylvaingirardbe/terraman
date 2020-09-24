import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';
import { IpcRenderer } from 'electron';
import { ClimateStatus } from './climate-status';
import { LoggerService } from '../logger.service';

@Injectable({
    providedIn: 'root'
})
export class ClimateService {
    status$ = new BehaviorSubject<ClimateStatus[]>(null as []);

    currentStatus: ClimateStatus[] = [];

    private ipc: IpcRenderer;

    constructor(private readonly logger: LoggerService) {
        logger.log('ClimateService instantiated...');

        if ((<any>window).require) {
            try {
                this.ipc = (<any>window).require('electron').ipcRenderer;
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('App not running inside Electron!');
        }

        setInterval(() => this.ipc.send('requestStatus'), 1000);
        this.ipc.on('statusReceived', (event, args) => {
            for(const index in args) {
                this.currentStatus[index] = {
                    index: +index,
                    humidity: args[index][3],
                    humiditySetpoint: args[index][4],
                    temp: args[index][0],
                    temperatureSetpoint: args[index][1],
                    heating: args[index][2],
                    misting: args[index][5]
                } as ClimateStatus;
            }
            console.log('Emitting status', this.currentStatus);
            this.status$.next(this.currentStatus);
        });

        this.status$.pipe(
            filter(status => !!status)
        )
        .subscribe(s => {
            s.forEach(status => this.ipc.send('changeSetPoint', { 
                index: status.index,
                temperature: status.temperatureSetpoint,
                humidity: status.humiditySetpoint
            }));
        });
    }

    increaseTemperature(index, amount: number) {
        this.currentStatus[index].temperatureSetpoint += amount;
        this.status$.next(this.currentStatus);
    }

    decreaseTemperature(index, amount: number) {
        this.currentStatus[index].temperatureSetpoint -= amount;
        this.status$.next(this.currentStatus);
    }

    increaseHumidity(index, amount: number) {
        this.currentStatus[index].humiditySetpoint += amount;
        this.status$.next(this.currentStatus);
    }

    decreaseHumidity(index, amount: number) {
        this.currentStatus[index].humiditySetpoint -= amount;
        this.status$.next(this.currentStatus);
    }

    getSensorStatus(): Observable<ClimateStatus[]> {
        return this.status$.asObservable();
    }

    exit() {
        this.ipc.send('requestExit');
    }
}