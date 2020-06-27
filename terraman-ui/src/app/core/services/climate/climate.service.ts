import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClimateService { 
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