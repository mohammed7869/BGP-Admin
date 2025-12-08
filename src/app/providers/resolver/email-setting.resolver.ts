import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EmailSettingNewComponent } from 'src/app/pages/admin/email-setting/email-setting-new/email-setting-new.component';
import { EmailSettingService } from '../services/email-setting.service';

@Injectable({
  providedIn: 'root'
})
export class EmailSettingResolver implements Resolve<EmailSettingNewComponent> {

  constructor(private groupServiceService: EmailSettingService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
