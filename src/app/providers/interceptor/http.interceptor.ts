// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { appCommon } from 'src/app/common/_appCommon';
// import { LocalStorageService } from '../services/local-storage.service';

// @Injectable()
// export class httpInterceptor implements HttpInterceptor {

//   public appCommon = appCommon;

//   constructor(private localStorageServiceService: LocalStorageService) { }

//   intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {

//     let tokenInfo = this.localStorageServiceService.getItem(this.appCommon.LocalStorageKeyType.TokenInfo);
//     let cloneReq = request;

//     if (tokenInfo && tokenInfo.jwtToken) {
//       cloneReq = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${tokenInfo.jwtToken}`
//         }
//       });
//     }

//     return newRequest.handle(cloneReq);
//   }

// }
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageService } from '../services/local-storage.service';
import { TenantConfigService } from 'src/app/core/services/tenant-config.service';

@Injectable()
export class httpInterceptor implements HttpInterceptor {

  public appCommon = appCommon;

  constructor(
    private localStorageServiceService: LocalStorageService,
    private tenantConfigService: TenantConfigService
  ) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {

    let tokenInfo = this.localStorageServiceService.getItem(this.appCommon.LocalStorageKeyType.TokenInfo);
    let cloneReq = request;

    // Use Bearer token authentication for BGP API
    if (tokenInfo && tokenInfo.token) {
      cloneReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenInfo.token}`
        }
      });
    }

    return newRequest.handle(cloneReq);
  }

}
