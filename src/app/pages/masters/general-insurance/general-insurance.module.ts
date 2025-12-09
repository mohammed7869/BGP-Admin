import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralInsuranceListComponent } from './general-insurance-list/general-insurance-list.component';
import { GeneralInsuranceDetailsComponent } from './general-insurance-details/general-insurance-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { GeneralInsuranceResolver } from 'src/app/providers/resolver/general-insurance.resolver';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    GeneralInsuranceListComponent,
    GeneralInsuranceDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: GeneralInsuranceListComponent,
        children: [
          {
            path: 'new',
            component: GeneralInsuranceDetailsComponent
          },
          {
            path: 'edit/:id',
            component: GeneralInsuranceDetailsComponent,
            resolve: {
              recordData: GeneralInsuranceResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class GeneralInsuranceModule { }
