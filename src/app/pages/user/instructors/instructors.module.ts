import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructorsListComponent } from './instructors-list.component';
import { InstructorsFormComponent } from './instructors-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModuleCommon } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [InstructorsListComponent, InstructorsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: InstructorsListComponent
      },
      {
        path: 'new',
        component: InstructorsFormComponent
      },
      {
        path: 'edit/:id',
        component: InstructorsFormComponent
      }
    ])
  ],
  exports: [InstructorsListComponent, InstructorsFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstructorsModule {} 