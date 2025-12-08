import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNewComponent } from './user-new/user-new.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { UserResolver } from 'src/app/providers/resolver/user.resolver';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModuleCommon } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    UserNewComponent,
    UserSearchComponent,
    UserPermissionComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    CommonModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: UserSearchComponent,
        children: [
          {
            path: 'new',
            component: UserNewComponent
          },
          {
            path: 'edit/:id',
            component: UserNewComponent,
            resolve: {
              recordData: UserResolver
            }
          }
        ]
      },
      {
        path: 'permission',
        component: UserPermissionComponent,
      },
    ]),
    AgGridModule
  ]
})
export class UserModule { }
