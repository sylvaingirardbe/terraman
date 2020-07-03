import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClimateService } from '../core/services/climate/climate.service';
import { Observable } from 'rxjs';
import { IpcRenderer } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  temperature$: Observable<number>;
  setPoint$: Observable<number>;
  humidity$: Observable<number>;

  private ipc: IpcRenderer
  constructor(private router: Router, private climateService: ClimateService) { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  ngOnInit(): void { 
    this.temperature$ = this.climateService.getTemperature();
    this.setPoint$ = this.climateService.getSetpoint();
    this.humidity$ = this.climateService.getHumidity();

    this.ipc.on('serialPortsReceived', (event, args) => console.log('Ports', args));
    this.ipc.send('getSerialPorts');
  }

  decreaseTemp(amount: number) {
    this.climateService.decreaseSetpoint(amount);
  }

  increaseTemp(amount: number) {
    this.climateService.increaseSetpoint(amount);
  }
}
