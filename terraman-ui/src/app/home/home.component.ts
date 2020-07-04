import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClimateService } from '../core/services/climate/climate.service';
import { Observable } from 'rxjs';
import { IpcRenderer } from 'electron';
import { ClimateStatus } from '../core/services/climate/climate-status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  setPoint$: Observable<number>;
  status$: Observable<ClimateStatus>;

  constructor(private climateService: ClimateService) { 
  }

  ngOnInit(): void { 
    this.status$ = this.climateService.getStatus();
    this.setPoint$ = this.climateService.getSetpoint();
  }

  decreaseTemp(amount: number) {
    this.climateService.decreaseSetpoint(amount);
  }

  increaseTemp(amount: number) {
    this.climateService.increaseSetpoint(amount);
  }
}
