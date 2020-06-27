import { Injectable } from '@angular/core';
import { Observable, interval, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClimateService {
    setPoint$ = new BehaviorSubject(31);

    increaseSetpoint(amount: number) {
        this.setPoint$.next(this.setPoint$.value + amount);
    }

    decreaseSetpoint(amount: number) {
        this.setPoint$.next(this.setPoint$.value - amount);
    }

    getSetpoint(): Observable<number> {
        return this.setPoint$.asObservable();
    } 

    getTemperature(): Observable<number> {
        return interval(250).pipe(
            map(_ => Math.random() * (35 - 20) + 20)
        );
    }

    getHumidity(): Observable<number> {
        return interval(250).pipe(
            map(_ => Math.random() * (100 - 30) + 30)
        );
    }
}