import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/Accounts`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
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

  export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.httpClient.post<any>(`${baseURL}/Export`, fdata, header);
  }

  userPermissionList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UserPermissionList`, fdata);
  }

  permissionList(): Observable<any> {
    return this.httpClient.post(`${baseURL}/PermissionList`, null);
  }

  updatePermissions(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UpdatePermissions`, fdata);
  }

  RefreshITSData(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/RefreshITSData`, fdata);
  }
}