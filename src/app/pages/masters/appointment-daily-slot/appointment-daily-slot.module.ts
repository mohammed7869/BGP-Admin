import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDailySlotListComponent } from './appointment-daily-slot-list/appointment-daily-slot-list.component';
import { AppointmentDailySlotDetailsComponent } from './appointment-daily-slot-details/appointment-daily-slot-details.component';
import { AppointmentDailySlotResolver } from 'src/app/providers/resolver/appointment-daily-slot.resolver';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    AppointmentDailySlotListComponent,
    AppointmentDailySlotDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppointmentDailySlotListComponent,
        children: [
          {
            path: 'new',
            component: AppointmentDailySlotDetailsComponent
          },
          {
            path: 'edit/:id',
            component: AppointmentDailySlotDetailsComponent,
            resolve: {
              recordData: AppointmentDailySlotResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class AppointmentDailySlotModule { }
