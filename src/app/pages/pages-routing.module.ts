import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'custom-message',
    loadChildren: () => import('./custom-message/custom-message.module').then((m) => m.CustomMessageModule)
  },
  {
    path: 'email-setting',
    loadChildren: () => import('./email-setting/email-setting.module').then((m) => m.EmailSettingModule)
  },
  {
    path: 'email-template',
    loadChildren: () => import('./email-template/email-template.module').then((m) => m.EmailTemplateModule)
  }, 
  {
    path: 'miqaats',
    loadChildren: () => import('./miqaat/miqaat.module').then((m) => m.MiqaatModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
