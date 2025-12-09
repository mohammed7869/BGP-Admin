import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CmsTagService } from '../services/cms-tag.service';

@Injectable({
  providedIn: 'root'
})
export class CmsTagResolver implements Resolve<any> {

  constructor(private cmsTagService: CmsTagService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const id = parseInt(route.params.id);
    console.log('Resolver: Fetching tag with ID:', id);
    return this.cmsTagService.getById(id);
  }
}
