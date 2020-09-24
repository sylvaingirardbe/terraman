import { Component, OnInit } from '@angular/core';
import { ClimateService } from '../../core/services/climate/climate.service';
import { Observable } from 'rxjs';
import { ClimateStatus } from '../../core/services/climate/climate-status';

@Component({
  selector: 'app-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.scss']
})
export class ClimateComponent implements OnInit {
  status$: Observable<ClimateStatus[]>;

  constructor(
    private climateService: ClimateService,
  ) { 
  }

  ngOnInit(): void { 
    this.status$ = this.climateService.getSensorStatus();
  }

  decreaseTemp(index, amount: number) {
    this.climateService.decreaseTemperature(index, amount);
  }

  increaseTemp(index, amount: number) {
    this.climateService.increaseTemperature(index, amount);
  }
  
  decreaseHumidity(index, amount: number) {
    this.climateService.decreaseHumidity(index, amount);
  }

  increaseHumidity(index, amount: number) {
    this.climateService.increaseHumidity(index, amount);
  }
}
