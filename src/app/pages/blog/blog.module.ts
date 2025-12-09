import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogNewComponent } from './blog-new/blog-new.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { BlogResolver } from 'src/app/providers/resolver/blog.resolver';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModuleCommon } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BlogNewComponent,
    BlogSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    CKEditorModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: BlogSearchComponent,
        children: [
          {
            path: 'new',
            component: BlogNewComponent
          },
          {
            path: 'edit/:id',
            component: BlogNewComponent,
            resolve: {
              recordData: BlogResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class BlogModule { }
