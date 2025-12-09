import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const baseURL = `${environment.apiUrl}/api/1/cms/page`;

@Injectable({
  providedIn: "root",
})
export class CmsPageService {
  constructor(private httpClient: HttpClient) {}

  getAll(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/get/all`, data);
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/get/${id}`);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/create`, data);
  }

  createWithFormData(formData: FormData): Observable<any> {
    return this.httpClient.post(`${baseURL}/create`, formData);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${baseURL}/delete/${id}`);
  }

  export(fdata: any): Observable<any> {
    var header: any = {
      headers: { Accept: "application/octet-stream" },
      responseType: "blob",
    };
    return this.httpClient.post<any>(`${baseURL}/export`, fdata, header);
  }

  saveBlogMappings(pageId: number, blogs: any[]): Observable<any> {
    const data = {
      pageId: pageId,
      blogs: blogs
    };
    return this.httpClient.post(`${baseURL}/blogs/save`, data);
  }
}
