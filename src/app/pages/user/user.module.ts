import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'learners',
        loadChildren: () => import('./learners/learners.module').then(m => m.LearnersModule)
      },
      {
        path: 'instructors',
        loadChildren: () => import('./instructors/instructors.module').then(m => m.InstructorsModule)
      },
      {
        path: '',
        redirectTo: 'learners',
        pathMatch: 'full'
      }
    ])
  ]
})
export class UserModule { }
