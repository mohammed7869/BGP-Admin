import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppointmentDailySlotDetailsComponent } from 'src/app/pages/masters/appointment-daily-slot/appointment-daily-slot-details/appointment-daily-slot-details.component';
import { AppointmentDailySlotService } from '../services/appointment-daily-slot.service';

@Injectable({
  providedIn: 'root'
})

export class AppointmentDailySlotResolver implements Resolve<AppointmentDailySlotDetailsComponent> {

  constructor(private service: AppointmentDailySlotService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.detail(parseInt(route.params.id));
  }
}