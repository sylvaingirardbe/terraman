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
  setPoint$: Observable<number>;
  status$: Observable<ClimateStatus>;

  constructor(
    private climateService: ClimateService,
  ) { 
  }

  ngOnInit(): void { 
    this.status$ = this.climateService.getSensorStatus();
    this.setPoint$ = this.climateService.getSetpoint();
  }

  decreaseTemp(amount: number) {
    this.climateService.decreaseSetpoint(amount);
  }

  increaseTemp(amount: number) {
    this.climateService.increaseSetpoint(amount);
  }
}
