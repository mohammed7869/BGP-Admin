import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GeneralInsuranceDetailsComponent } from 'src/app/pages/masters/general-insurance/general-insurance-details/general-insurance-details.component';
import { GeneralInsuranceService } from '../services/general-insurance.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralInsuranceResolver implements Resolve<GeneralInsuranceDetailsComponent> {

  constructor(private service: GeneralInsuranceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.detail(parseInt(route.params.id));
  }
}