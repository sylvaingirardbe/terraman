import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { GaugeModule } from 'angular-gauge';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    HomeComponent, 
    ScheduleComponent
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    HomeRoutingModule, 
    GaugeModule.forRoot(), 
    NgbModalModule
  ],
  entryComponents: [
    ScheduleComponent
  ]
})
export class HomeModule { }
