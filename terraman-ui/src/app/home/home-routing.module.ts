import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ClimateComponent } from './climate/climate.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  {
    path: 'climate',
    component: ClimateComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
