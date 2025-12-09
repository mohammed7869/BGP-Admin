import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentLocationListComponent } from './appointment-location-list/appointment-location-list.component';
import { AppointmentLocationDetailsComponent } from './appointment-location-details/appointment-location-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppointmentLocationResolver } from 'src/app/providers/resolver/appointment-location.resolver';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    AppointmentLocationListComponent,
    AppointmentLocationDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppointmentLocationListComponent,
        children: [
          {
            path: 'new',
            component: AppointmentLocationDetailsComponent
          },
          {
            path: 'edit/:id',
            component: AppointmentLocationDetailsComponent,
            resolve: {
              recordData: AppointmentLocationResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class AppointmentLocationModule { }
