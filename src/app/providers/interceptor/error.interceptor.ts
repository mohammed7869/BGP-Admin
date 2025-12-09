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
import { ErrorUtils } from 'src/app/common/error-utils';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public appCommon = appCommon;
  constructor(private modalService: NgbModal,
    private router: Router, private authServiceService: AuthServiceService, private toastrMessageService: ToastrMessageService) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler):
    Observable<HttpEvent<any>> {

    return newRequest.handle(request).pipe(catchError(err => {

      // Check for session expiry using the utility function
      if (ErrorUtils.isSessionExpiredError(err)) {
        this.toastrMessageService.showError("Your session has expired. Please login again.", "Session Expired");
        this.authServiceService.logout(); // Clear user data for session expiry
        return throwError(err.error);
      }

      // Handle 500 Internal Server Error
      if (err.status === 500) {
        const errorMessage = ErrorUtils.extractErrorMessage(err);
        
        if (errorMessage.includes("Object reference not set to an instance of an object")) {
          this.authServiceService.logout();
          return throwError(err.error);
        } else if (errorMessage) {
          this.toastrMessageService.showError(errorMessage, "Error");
        } else {
          this.toastrMessageService.showError("An error occurred while processing your request.", "Error");
        }
      }

      return throwError(err.error);
    }));
  }
}
