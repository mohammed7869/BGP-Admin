import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeNewComponent } from 'src/app/pages/admin/employee/employee-new/employee-new.component';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<EmployeeNewComponent> {

  constructor(private _service: ProfileService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this._service.detail(parseInt(route.params.id));
  }
}