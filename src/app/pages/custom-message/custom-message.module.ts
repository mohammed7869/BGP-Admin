import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMessageNewComponent } from './custom-message-new/custom-message-new.component';
import { CustomMessageSearchComponent } from './custom-message-search/custom-message-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMessageResolver } from 'src/app/providers/resolver/custom-message.resolver';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    CustomMessageNewComponent,
    CustomMessageSearchComponent
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
        component: CustomMessageSearchComponent,
        children: [
          {
            path: 'new',
            component: CustomMessageNewComponent
          },
          {
            path: 'edit/:id',
            component: CustomMessageNewComponent,
            resolve: {
              recordData: CustomMessageResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class CustomMessageModule { }
