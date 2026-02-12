import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsProfilesNewComponent } from './doctors-profiles-new/doctors-profiles-new.component';
import { DoctorsProfilesSearchComponent } from './doctors-profiles-search/doctors-profiles-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { DoctorsProfilesResolver } from 'src/app/providers/resolver/doctors-profiles.resolver';

@NgModule({
  declarations: [
    DoctorsProfilesNewComponent,
    DoctorsProfilesSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: DoctorsProfilesSearchComponent,
        children: [
          {
            path: 'new',
            component: DoctorsProfilesNewComponent
          },
          {
            path: 'edit/:id',
            component: DoctorsProfilesNewComponent,
            resolve: {
              recordData: DoctorsProfilesResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class DoctorsProfilesModule { }
