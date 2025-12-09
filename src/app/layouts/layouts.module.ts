import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

import { VerticalComponent } from './vertical/vertical.component';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [VerticalComponent, LayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [VerticalComponent]
})
export class LayoutsModule { }
