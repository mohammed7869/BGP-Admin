import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { EnquiryDetailsComponent } from './enquiry-details/enquiry-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    EnquiryComponent,
    EnquiryDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    CKEditorModule,
    RouterModule.forChild([
      {
        path: '',
        component: EnquiryComponent,
        children: [
          {
            path: 'edit/:id',
            component: EnquiryDetailsComponent,
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class EnquiryModule { }
