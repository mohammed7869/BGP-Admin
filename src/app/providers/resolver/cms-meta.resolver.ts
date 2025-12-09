import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CmsMetaService } from '../services/cms-meta.service';

@Injectable({
  providedIn: 'root'
})
export class CmsMetaResolver implements Resolve<any> {

  constructor(private cmsMetaService: CmsMetaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.cmsMetaService.getById(parseInt(route.params.id));
  }
}
