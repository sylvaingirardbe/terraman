import { Component, OnInit } from '@angular/core';
import { ClimateService } from '../../core/services/climate/climate.service';
import { combineLatest, Observable } from 'rxjs';
import { ClimateStatus } from '../../core/services/climate/climate-status';
import { SetPoint } from '../../core/services/climate/set-point';
import { map } from 'rxjs/operators';
import { Sensor } from './sensor';

@Component({
  selector: 'app-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.scss']
})
export class ClimateComponent implements OnInit {
  status$: Observable<ClimateStatus[]>;
  setPoints$: Observable<SetPoint[]>;

  sensors$: Observable<Sensor[]>;

  constructor(
    private climateService: ClimateService,
  ) { 
  }

  ngOnInit(): void { 
    this.status$ = this.climateService.getSensorStatus();
    this.setPoints$ = this.climateService.getSetPoints();
    this.sensors$ = combineLatest([this.status$, this.setPoints$]).pipe(
      map(([status, setPoints]) => {
        let result = [];
        status.forEach((s, i) => result = [
          ...result,
          {
            status: s,
            setPoint: setPoints[i]
          }
        ])
        return result;
      })
    )
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
