import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../services/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<any> {
  constructor(private categoryService: CategoryService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.categoryService.detail(route.params['id']);
  }
} 