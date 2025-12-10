import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiqaatListComponent } from './miqaat-list/miqaat-list.component';
import { MiqaatEditComponent } from './miqaat-edit/miqaat-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModuleCommon } from '../../shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MiqaatListComponent,
    MiqaatEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: MiqaatListComponent
      },
      {
        path: 'edit/:id',
        component: MiqaatEditComponent
      }
    ]),
    AgGridModule
  ]
})
export class MiqaatModule { }

