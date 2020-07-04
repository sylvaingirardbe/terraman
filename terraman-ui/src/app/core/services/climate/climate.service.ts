import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { IpcRenderer } from 'electron';
import { ClimateStatus } from './climate-status';

@Injectable({
    providedIn: 'root'
})
export class ClimateService {
    setPoint$ = new BehaviorSubject(30);
    status$ = new BehaviorSubject<ClimateStatus>(null as ClimateStatus);

    private ipc: IpcRenderer;

    constructor() {
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
        this.ipc.on('statusReceived', (event, args) => this.status$.next(args));
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

    getStatus(): Observable<ClimateStatus> {
        return this.status$.asObservable().pipe(filter(status => status !== null));
    }
}