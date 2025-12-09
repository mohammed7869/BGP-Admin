import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearnersListComponent } from './learners-list.component';
import { LearnersFormComponent } from './learners-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModuleCommon } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LearnersListComponent, LearnersFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: LearnersListComponent
      },
      {
        path: 'new',
        component: LearnersFormComponent
      },
      {
        path: 'edit/:id',
        component: LearnersFormComponent
      }
    ])
  ],
  exports: [LearnersListComponent, LearnersFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnersModule {} 