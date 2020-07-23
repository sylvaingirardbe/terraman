import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ClimateComponent } from './climate/climate.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ClimateComponent, 
    ScheduleComponent
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    HomeRoutingModule
  ],
  entryComponents: [
    ScheduleComponent
  ]
})
export class HomeModule { }
