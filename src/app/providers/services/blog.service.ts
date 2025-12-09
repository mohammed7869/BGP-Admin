import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const baseURL = `${environment.apiUrl}/api/1/cms/blog-post`;

@Injectable({
  providedIn: "root",
})
export class BlogService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.post(`${baseURL}/get/all`, {});
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/get/${id}`);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/create`, data);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${baseURL}/delete/${id}`);
  }
}
