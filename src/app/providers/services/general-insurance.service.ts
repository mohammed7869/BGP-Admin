import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/api/1/insurance`;

@Injectable({
  providedIn: 'root'
})

export class GeneralInsuranceService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/get/all`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/create`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${baseURL}/delete/${id}`);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/get/${id}`);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update`, data);
  }

  dropdownList(): Observable<any> {
    var fdata = {}
    return this.httpClient.post(`${baseURL}/DropDownList`, fdata);
  }

  export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.httpClient.post<any>(`${baseURL}/Export`, fdata, header);
  }
}