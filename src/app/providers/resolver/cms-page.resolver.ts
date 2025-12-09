import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CmsPageService } from '../services/cms-page.service';

@Injectable({
  providedIn: 'root'
})
export class CmsPageResolver implements Resolve<any> {

  constructor(private service: CmsPageService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    return this.service.getById(Number(id));
  }
}
