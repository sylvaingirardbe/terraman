import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, ScheduleComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { ClimateComponent } from './components/climate/climate.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { GaugeModule } from 'angular-gauge';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [PageNotFoundComponent, ScheduleComponent, WebviewDirective, ClimateComponent],
  imports: [
    CommonModule, 
    TranslateModule, 
    FormsModule,
    GaugeModule.forRoot(), 
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [TranslateModule, WebviewDirective, FormsModule, ScheduleComponent, ClimateComponent]
})
export class SharedModule { }
