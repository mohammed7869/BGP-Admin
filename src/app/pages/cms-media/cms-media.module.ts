import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaNewComponent } from './cms-media-new/cms-media-new.component';
import { CmsMediaSearchComponent } from './cms-media-search/cms-media-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CmsMediaResolver } from 'src/app/providers/resolver/cms-media.resolver';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    CmsMediaNewComponent,
    CmsMediaSearchComponent
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
        component: CmsMediaSearchComponent,
        children: [
          {
            path: 'new',
            component: CmsMediaNewComponent
          },
          {
            path: 'edit/:id',
            component: CmsMediaNewComponent,
            resolve: {
              recordData: CmsMediaResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class CmsMediaModule { }
