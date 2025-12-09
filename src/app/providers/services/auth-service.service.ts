import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

const baseURL = `${environment.apiUrl}/api/1`;
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public appCommon = appCommon;
  userData: any = {};

  constructor(
    private httpClient: HttpClient,
    private localStorageServiceService: LocalStorageService,
    private router: Router,
  ) { }

  adminLogin(username: string, password: string, shortcode: string) {

    var data = {
      'username': username,
      'password': password,
      'shortcode': shortcode
    }

    return this.httpClient.post<any>(`${baseURL}/login`, data)
      .pipe(tap(user => {
        if (user) {
          var userLoginDetail = {
            companyShortCode: user.company.shortCode,
            userLoginName: user.user.login_Name,
            userName: `${user.user.first_Name} ${user.user.lastname}`
          };
          this.localStorageServiceService.setItem(this.appCommon.LocalStorageKeyType.TokenInfo, user);
          this.localStorageServiceService.setItem(this.appCommon.LocalStorageKeyType.UserLoginDetail, userLoginDetail);
        }
        return user;
      }));
  }

  applicantLogin(username: string, password: string) {

    var data = {
      'email': username,
      'password': password
    }

    return this.httpClient.post<any>(`${baseURL}/ApplicantAuthenticate`, data)
      .pipe(first(user => {
        if (user && user.jwtToken) {
          this.localStorageServiceService.setItem(this.appCommon.LocalStorageKeyType.TokenInfo, user);
        }
        return user;
      }));
  }

  logout() {
    this.router.navigate(['/account/login']);
    this.localStorageServiceService.removeItem(this.appCommon.LocalStorageKeyType.TokenInfo);
  }

  list(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/List`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/Add`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${baseURL}/` + id);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/Get`, id);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/Update`, data);
  }

  dropdownList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/DropDownList`, fdata);
  }

  permissionList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/PermissionList`, fdata);
  }

  updatePermissions(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UpdatePermissions`, fdata);
  }

  listApplicants(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/ListApplicants`, fdata);
  }

  forgetpassword(email: string) {

    var data = {
      'email': email,
    }

    return this.httpClient.post<any>(environment.apiUrl + '/Accounts/forgot-password', data)
      .pipe();
  }

  verifyforgetpasswordotp(token: string) {

    var data = {
      'token': token,
    }

    return this.httpClient.post<any>(environment.apiUrl + '/api/accounts/validate-reset-token', data)
      .pipe(first(user => {
        return user;
      }));
  }

  resetforgetpassword(data) {
    return this.httpClient.post<any>(environment.apiUrl + '/Accounts/resetPasswordLogin', data)
      .pipe(first(user => {
        return user;
      }));
  }

  resendotp(data: number) {
    return this.httpClient.post<any>(environment.apiUrl + '/Accounts/resend-email-otp', data)
      .pipe(first(user => {
        return user;
      }));
  }

  verifyOtpUser(data) {
    return this.httpClient.post<any>(environment.apiUrl + '/Accounts/validate-reset-token', data)
      .pipe(first(user => {
        return user;
      }));
  }
}
