import { Injectable } from '@angular/core';
import { AppConfig } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    log(message: string, data: any = {}) {
        if(!AppConfig.production) {
            console.log(message, data);
        }
    }
}