import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, first, tap } from 'rxjs/operators';
import { IpcRenderer } from 'electron';
import { ClimateStatus } from './climate-status';
import { LoggerService } from '../logger.service';
import { SetPoint } from './set-point';

@Injectable({
    providedIn: 'root'
})
export class ClimateService {
    status$ = new BehaviorSubject<ClimateStatus[]>(null as []);
    setPoints$ = new BehaviorSubject<SetPoint[]>(null as []);
    setPoints: SetPoint[] = [];
    currentStatus: ClimateStatus[] = [];

    private ipc: IpcRenderer;

    constructor(logger: LoggerService) {
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
                    humidity: args[index][2],
                    temp: args[index][0],
                    heating: args[index][1],
                    misting: args[index][3]
                } as ClimateStatus;
            }
            this.status$.next([...this.currentStatus]);
        });

        this.setPoints$.pipe(
            filter(setPoints => !!setPoints)
        )
        .subscribe(s => {
            s.forEach((setPoint, i) => this.ipc.send('changeSetPoint', { 
                index: i,   
                temperature: setPoint.temperature,
                humidity: setPoint.humidity
            }));
        });

        //Initialize setPoints
        this.status$.pipe(
            filter(status => !!status),
            first()
        )
        .subscribe(s => {
            s.forEach(_ => {
                this.setPoints = [
                    ...this.setPoints,
                    {
                        humidity: 70,
                        temperature: 28
                    } as SetPoint
                ]
            });
            
            this.setPoints$.next([...this.setPoints]);
        })
    }

    increaseTemperature(index, amount: number) {
        this.setPoints[index].temperature += amount;
        this.setPoints$.next(this.setPoints);
    }

    decreaseTemperature(index, amount: number) {
        this.setPoints[index].temperature -= amount;
        this.setPoints$.next(this.setPoints);
    }

    increaseHumidity(index, amount: number) {
        this.setPoints[index].humidity += amount;
        this.setPoints$.next(this.setPoints);
    }

    decreaseHumidity(index, amount: number) {
        this.setPoints[index].humidity -= amount;
        this.setPoints$.next(this.setPoints);
    }

    getSensorStatus(): Observable<ClimateStatus[]> {
        return this.status$.pipe(
            filter(status => 
                !!status
            ),
            distinctUntilChanged((x, y) => 
                JSON.stringify(x) === JSON.stringify(y)
            ),
            tap(status => console.log('After distinct status', status))
        );
    }

    getSetPoints(): Observable<SetPoint[]> {
        return this.setPoints$.pipe(
            filter(setPoint => 
                !!setPoint
            )
        );
    }

    exit() {
        this.ipc.send('requestExit');
    }
}