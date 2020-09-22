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
    setPoint$ = new BehaviorSubject(30);
    status$ = new BehaviorSubject<ClimateStatus>(null as ClimateStatus);

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
            logger.log('Status received', args);
            this.status$.next(args);
        });
    }

    increaseSetpoint(amount: number) {
        this.setPoint$.next(this.setPoint$.value + amount);
    }

    decreaseSetpoint(amount: number) {
        this.setPoint$.next(this.setPoint$.value - amount);
    }

    getSetpoint(): Observable<number> {
        return this.setPoint$.asObservable().pipe(
            tap(setPoint => this.ipc.send('changeSetPoint', setPoint))
        );
    }

    getSensorStatus(): Observable<ClimateStatus> {
        return this.status$.asObservable().pipe(
            filter(status => !!status && !!status[0][3] && !!status[0][0]),
            map(status => ({
                humidity: status[0][3],
                temp: status[0][0],
                heating: status[0][2]
            } as ClimateStatus)), 
        );
    }

    exit() {
        this.ipc.send('requestExit');
    }
}