import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMetaNewComponent } from './cms-meta-new/cms-meta-new.component';
import { CmsMetaSearchComponent } from './cms-meta-search/cms-meta-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CmsMetaResolver } from 'src/app/providers/resolver/cms-meta.resolver';

@NgModule({
  declarations: [
    CmsMetaNewComponent,
    CmsMetaSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: CmsMetaSearchComponent,
        children: [
          {
            path: 'new',
            component: CmsMetaNewComponent
          },
          {
            path: 'edit/:id',
            component: CmsMetaNewComponent,
            resolve: {
              recordData: CmsMetaResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class CmsMetaModule { }
