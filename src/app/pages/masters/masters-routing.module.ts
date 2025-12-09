import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'appointment-daily-slot',
    loadChildren: () => import('./appointment-daily-slot/appointment-daily-slot.module').then((m) => m.AppointmentDailySlotModule)
  },
  {
    path: 'appointment-location',
    loadChildren: () => import('./appointment-location/appointment-location.module').then((m) => m.AppointmentLocationModule)
  },
  {
    path: 'general-insurance',
    loadChildren: () => import('./general-insurance/general-insurance.module').then((m) => m.GeneralInsuranceModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
