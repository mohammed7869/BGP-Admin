import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailTemplateNewComponent } from 'src/app/pages/email-template/email-template-new/email-template-new.component';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateResolver implements Resolve<EmailTemplateNewComponent> {

  constructor(private groupServiceService: EmailTemplateService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
