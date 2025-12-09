import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsTagNewComponent } from './cms-tag-new/cms-tag-new.component';
import { CmsTagSearchComponent } from './cms-tag-search/cms-tag-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CmsTagResolver } from 'src/app/providers/resolver/cms-tag.resolver';

@NgModule({
  declarations: [
    CmsTagNewComponent,
    CmsTagSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: CmsTagSearchComponent,
        children: [
          {
            path: 'new',
            component: CmsTagNewComponent
          },
          {
            path: 'edit/:id',
            component: CmsTagNewComponent,
            resolve: {
              recordData: CmsTagResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class CmsTagModule { }
