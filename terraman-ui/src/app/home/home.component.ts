import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClimateService } from '../core/services/climate/climate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  temperature$: Observable<number>;
  humidity$: Observable<number>;

  constructor(private router: Router, private climateService: ClimateService) { }

  ngOnInit(): void { 
    this.temperature$ = this.climateService.getTemperature();
    this.humidity$ = this.climateService.getHumidity();
  }
}
