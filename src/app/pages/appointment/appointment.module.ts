import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule, NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { AppointmentNewComponent } from './appointment-new/appointment-new.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModuleCommon } from '../../shared/shared.module';
import { AppointmentResolver } from 'src/app/providers/resolver/appointment.resolver';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentDetailsComponent,
    AppointmentNewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule,
    NgbModalModule,
    NgSelectModule,
    NgbCollapseModule,
    SharedModuleCommon,
    NgxIntlTelInputModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppointmentListComponent,
        children: [
          {
            path: 'new',
            component: AppointmentNewComponent
          },
          {
            path: 'edit/:id',
            component: AppointmentDetailsComponent,
            resolve: {
              recordData: AppointmentResolver
            }
          }
        ]
      },
      {
        path: 'archived',
        component: AppointmentListComponent
      }
    ]),
    AgGridModule,
    ArchwizardModule
  ]
})
export class AppointmentModule { }
