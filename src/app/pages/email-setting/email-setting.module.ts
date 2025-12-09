import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSettingNewComponent } from './email-setting-new/email-setting-new.component';
import { EmailSettingSearchComponent } from './email-setting-search/email-setting-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { EmailSettingResolver } from 'src/app/providers/resolver/email-setting.resolver';



@NgModule({
  declarations: [
    EmailSettingNewComponent,
    EmailSettingSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: EmailSettingSearchComponent,
        children: [
          {
            path: 'new',
            component: EmailSettingNewComponent
          },
          {
            path: 'edit/:id',
            component: EmailSettingNewComponent,
            resolve: {
              recordData: EmailSettingResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class EmailSettingModule { }
