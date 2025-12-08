import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    path: '',
    redirectTo: '/error/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
