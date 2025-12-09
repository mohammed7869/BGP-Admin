import { CategoryService } from './category.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

const baseURL = `${environment.apiUrl}/Common`;

@Injectable({
  providedIn: 'root'
})


export class CommonService {

  public appCommon = appCommon;

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService, private categoryService: CategoryService) { }
  // Fetch categories for dropdowns
  getCategoryList(): Observable<any> {
    return this.categoryService.list();
  }

  getUserData(): any { return this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo); }

  adminDashboardResult(): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminDashboardResult`, {});
  }

  applicantDashboardResult(): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantDashboardResult`, {});
  }

  applicantDashboardApplicationList(data): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantDashboardApplicationList`, data);
  }

  adminDashboardApplicationList(data): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminDashboardApplicationList`, data);
  }

  getJamaatData(): Observable<any> {
    return this.httpClient.get("assets/jamaat.csv", { responseType: 'text' });
  }
}
