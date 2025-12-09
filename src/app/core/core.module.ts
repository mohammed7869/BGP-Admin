import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantConfigService } from './services/tenant-config.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    TenantConfigService
  ]
})
export class CoreModule { }
