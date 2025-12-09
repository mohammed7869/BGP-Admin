import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/api/1/cms/enquiry`;

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/get/all`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/add`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/delete`, id);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/get`, id);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update`, data);
  }

  export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.httpClient.post<any>(`${baseURL}/export`, fdata, header);
  }
}
