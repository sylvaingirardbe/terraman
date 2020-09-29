import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClimateStatus } from '../../../core/services/climate/climate-status';
import { SetPoint } from '../../../core/services/climate/set-point';
import { faFire, faShower } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'terraman-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.css']
})
export class ClimateComponent implements OnInit {
  @Input() status: ClimateStatus;
  @Input() setPoint: SetPoint;
  @Output() increaseTemp: EventEmitter<number> = new EventEmitter<number>();
  @Output() decreaseTemp: EventEmitter<number> = new EventEmitter<number>();
  @Output() increaseHumidity: EventEmitter<number> = new EventEmitter<number>();
  @Output() decreaseHumidity: EventEmitter<number> = new EventEmitter<number>();

  faFire = faFire
  faShower = faShower

  constructor() { }

  ngOnInit(): void {
  }
}
