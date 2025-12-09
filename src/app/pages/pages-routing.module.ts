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
    path: 'enquiry',
    loadChildren: () => import('./enquiry/enquiry.module').then((m) => m.EnquiryModule)
  },
  {
    path: 'doctors-profiles',
    loadChildren: () => import('./doctors-profiles/doctors-profiles.module').then((m) => m.DoctorsProfilesModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./appointment/appointment.module').then((m) => m.AppointmentModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./appointment/appointment.module').then((m) => m.AppointmentModule)
  },
  {
    path: 'masters',
    loadChildren: () => import('./masters/masters.module').then((m) => m.MastersModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule)
  },
  {
    path: 'cms-tag',
    loadChildren: () => import('./cms-tag/cms-tag.module').then((m) => m.CmsTagModule)
  },
  {
    path: 'cms-meta',
    loadChildren: () => import('./cms-meta/cms-meta.module').then((m) => m.CmsMetaModule)
  },
  {
    path: 'cms-media',
    loadChildren: () => import('./cms-media/cms-media.module').then((m) => m.CmsMediaModule)
  },
  {
    path: 'cms-page',
    loadChildren: () => import('./cms-page/cms-page.module').then((m) => m.CmsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
