import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppointmentLocationService } from '../services/appointment-location.service';
import { AppointmentLocationDetailsComponent } from 'src/app/pages/masters/appointment-location/appointment-location-details/appointment-location-details.component';

@Injectable({
  providedIn: 'root'
})

export class AppointmentLocationResolver implements Resolve<AppointmentLocationDetailsComponent> {

  constructor(private service: AppointmentLocationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.detail(parseInt(route.params.id));
  }
}