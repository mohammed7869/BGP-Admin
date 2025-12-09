import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateNewComponent } from './email-template-new/email-template-new.component';
import { EmailTemplateSearchComponent } from './email-template-search/email-template-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { EmailTemplateResolver } from 'src/app/providers/resolver/email-template.resolver';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    EmailTemplateNewComponent,
    EmailTemplateSearchComponent
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
        component: EmailTemplateSearchComponent,
        children: [
          {
            path: 'new',
            component: EmailTemplateNewComponent
          },
          {
            path: 'edit/:id',
            component: EmailTemplateNewComponent,
            resolve: {
              recordData: EmailTemplateResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class EmailTemplateModule { }
