import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppointmentDetailsComponent } from 'src/app/pages/appointment/appointment-details/appointment-details.component';
import { AppointmentService } from '../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolver implements Resolve<AppointmentDetailsComponent> {

  constructor(private appointmentService: AppointmentService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.appointmentService.detail(parseInt(route.params.id));
  }
}
