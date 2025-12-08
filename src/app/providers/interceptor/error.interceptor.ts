import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from '../services/auth-service.service';
import { ToastrMessageService } from '../services/toastr-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public appCommon = appCommon;
  constructor(private modalService: NgbModal,
    private router: Router, private authServiceService: AuthServiceService, private toastrMessageService: ToastrMessageService) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler):
    Observable<HttpEvent<any>> {

    return newRequest.handle(request).pipe(catchError(err => {

      if (err.status === 500) {
        if (err.error.message.includes("Object reference not set to an instance of an object")) {
          this.authServiceService.logout();
        } else {
          this.toastrMessageService.showError(err.error.message, "Error");
        }
      }
      return throwError(err.error);
    }));
  }
}
