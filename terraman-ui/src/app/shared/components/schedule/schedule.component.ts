import { Component, OnInit, Output, EventEmitter, Input, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventTimesChangedEvent, CalendarDayViewBeforeRenderEvent, CalendarEvent } from 'angular-calendar';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { Subject } from 'rxjs';

@Component({
  selector: 'terraman-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() viewDate: Date;

  /**
   * An array of events to display on view
   * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
   */
  @Input() events: CalendarEvent[] = [];

  /**
   * The number of segments in an hour. Must be <= 6
   */
  @Input() hourSegments: number = 2;

  /**
   * The height in pixels of each hour segment
   */
  @Input() hourSegmentHeight: number = 30;

  /**
   * The day start hours in 24 hour time. Must be 0-23
   */
  @Input() dayStartHour: number = 0;

  /**
   * The day start minutes. Must be 0-59
   */
  @Input() dayStartMinute: number = 0;

  /**
   * The day end hours in 24 hour time. Must be 0-23
   */
  @Input() dayEndHour: number = 23;

  /**
   * The day end minutes. Must be 0-59
   */
  @Input() dayEndMinute: number = 59;

  /**
   * An observable that when emitted on will re-render the current view
   */
  @Input() refresh: Subject<any>;

  /**
   * The locale used to format dates
   */
  @Input() locale: string = 'nl-BE';

  /**
   * The grid size to snap resizing and dragging of events to
   */
  @Input() eventSnapSize: number;

  /**
   * The placement of the event tooltip
   */
  @Input() tooltipPlacement: PlacementArray = 'auto';

  /**
   * A custom template to use for the event tooltips
   */
  @Input() tooltipTemplate: TemplateRef<any>;

  /**
   * Whether to append tooltips to the body or next to the trigger element
   */
  @Input() tooltipAppendToBody: boolean = true;

  /**
   * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
   * will be displayed immediately.
   */
  @Input() tooltipDelay: number | null = null;

  /**
   * A custom template to use to replace the hour segment
   */
  @Input() hourSegmentTemplate: TemplateRef<any>;

  /**
   * A custom template to use for day view events
   */
  @Input() eventTemplate: TemplateRef<any>;

  /**
   * A custom template to use for event titles
   */
  @Input() eventTitleTemplate: TemplateRef<any>;

  /**
   * A custom template to use for event actions
   */
  @Input() eventActionsTemplate: TemplateRef<any>;

  /**
   * Whether to snap events to a grid when dragging
   */
  @Input() snapDraggedEvents: boolean = true;

  /**
   * A custom template to use for the all day events label text
   */
  @Input() allDayEventsLabelTemplate: TemplateRef<any>;

  /**
   * A custom template to use for the current time marker
   */
  @Input() currentTimeMarkerTemplate: TemplateRef<any>;

  /**
   * Called when an event title is clicked
   */
  @Output() eventClicked = new EventEmitter<{
    event: CalendarEvent;
  }>();

  /**
   * Called when an hour segment is clicked
   */
  @Output() hourSegmentClicked = new EventEmitter<{
    date: Date;
  }>();

  /**
   * Called when an event is resized or dragged and dropped
   */
  @Output() eventTimesChanged = new EventEmitter<
    CalendarEventTimesChangedEvent
  >();

  /**
   * An output that will be called before the view is rendered for the current day.
   * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
   */
  @Output() beforeViewRender = new EventEmitter<
    CalendarDayViewBeforeRenderEvent
  >();

  constructor() { }

  ngOnInit(): void {
  }
}
