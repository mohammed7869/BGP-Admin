import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CmsMediaService } from '../services/cms-media.service';

@Injectable({
  providedIn: 'root'
})
export class CmsMediaResolver implements Resolve<any> {

  constructor(private service: CmsMediaService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    if (id) {
      return this.service.getById(+id);
    }
    return null;
  }
}
