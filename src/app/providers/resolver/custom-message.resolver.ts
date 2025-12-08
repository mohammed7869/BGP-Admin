import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CustomMessageNewComponent } from 'src/app/pages/admin/custom-message/custom-message-new/custom-message-new.component';
import { CustomMessageService } from '../services/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class CustomMessageResolver implements Resolve<CustomMessageNewComponent> {

  constructor(private groupServiceService: CustomMessageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
