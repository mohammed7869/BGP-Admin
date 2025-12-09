import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SubCategoryService } from '../services/category.service';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryResolver implements Resolve<any> {
  constructor(private subCategoryService: SubCategoryService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.subCategoryService.detail(route.params['id']);
  }
} 