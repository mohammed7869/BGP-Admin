import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { AppointmentDetailsModalComponent } from './appointment-details-modal/appointment-details-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    CalendarComponent,
    AppointmentDetailsModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    NgbModalModule,
    FullCalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: CalendarComponent,
      }
    ]),
    AgGridModule
  ]
})
export class CalendarModule { }
