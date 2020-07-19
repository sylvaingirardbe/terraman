import { Component, OnInit, Type } from '@angular/core';
import { ClimateService } from '../../core/services/climate/climate.service';
import { Observable } from 'rxjs';
import { ClimateStatus } from '../../core/services/climate/climate-status';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleComponent } from '../schedule/schedule.component';

const MODALS: {[name: string]: Type<any>} = {
  schedule: ScheduleComponent
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  setPoint$: Observable<number>;
  status$: Observable<ClimateStatus>;

  constructor(
    private climateService: ClimateService,
    private modalService: NgbModal
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

  exit() {
    this.climateService.exit();
  }

  showSchedule() {
    this.modalService.open(MODALS['schedule']);
  }
}
