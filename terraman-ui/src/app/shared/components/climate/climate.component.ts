import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClimateStatus } from '../../../core/services/climate/climate-status';

@Component({
  selector: 'terraman-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.css']
})
export class ClimateComponent implements OnInit {
  @Input() status: ClimateStatus;
  @Output() increaseTemp: EventEmitter<number> = new EventEmitter<number>();
  @Output() decreaseTemp: EventEmitter<number> = new EventEmitter<number>();
  @Output() increaseHumidity: EventEmitter<number> = new EventEmitter<number>();
  @Output() decreaseHumidity: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
