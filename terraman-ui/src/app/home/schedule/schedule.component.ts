import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  events: CalendarEvent[];
  today: Date;

  constructor() { }

  ngOnInit(): void {
    const event = {
      start: new Date('2020-07-21T07:00'),
      title: 'Lights & heating on',
      color: {
        primary: 'blue'
      },
      end: new Date('2020-07-21T19:00')
    } as CalendarEvent;

    this.events = [
      event
    ];

    this.today = new Date();
  }  
}
