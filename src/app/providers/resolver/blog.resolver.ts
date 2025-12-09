import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { BlogNewComponent } from 'src/app/pages/blog/blog-new/blog-new.component';

@Injectable({
  providedIn: 'root'
})
export class BlogResolver implements Resolve<BlogNewComponent> {

  constructor(private blogService: BlogService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.blogService.getById(parseInt(route.params.id));
  }
}
