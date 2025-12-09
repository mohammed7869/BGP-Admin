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
    let sessionId = tokenInfo?.user?.currentSessionId;
    let companyId = tokenInfo?.company?.id;
    
    // Get tenant ID from configuration if available
    let tenantId = this.tenantConfigService.getTenantId();

    if (tokenInfo && sessionId) {
      // Use configured tenant ID if available, otherwise use company ID from token
      const finalTenantId = tenantId || companyId;
      
      if (finalTenantId) {
        cloneReq = request.clone({
          setHeaders: {
            'X-TENANT-ID': String(finalTenantId),
            'X-Session-ID': String(sessionId),
          }
        });
      } else {
        // If no tenant ID available, just add session ID
        cloneReq = request.clone({
          setHeaders: {
            'X-Session-ID': String(sessionId),
          }
        });
      }
    }

    // let modifiedRequest = cloneReq;
    // if (['POST', 'PUT', 'PATCH'].includes(cloneReq.method)) {
    //   const body = { ...cloneReq.body, sessionId: sessionId };
    //   modifiedRequest = cloneReq.clone({
    //     body: body
    //   });
    // }

    return newRequest.handle(cloneReq);
  }

}
