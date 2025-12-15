import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { appCommon } from "src/app/common/_appCommon";

const baseURL = `${environment.apiUrl}/api/1`;

@Injectable({
  providedIn: "root",
})
export class MiqaatService {
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  private getHeaders(): HttpHeaders {
    const tokenInfo = this.localStorageService.getItem(
      appCommon.LocalStorageKeyType.TokenInfo
    );
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    if (tokenInfo && tokenInfo.token) {
      headers = headers.set("Authorization", `Bearer ${tokenInfo.token}`);
    } else {
      console.warn("No authentication token found. Please log in again.");
    }

    return headers;
  }

  getAll(): Observable<any> {
    return this.httpClient.get<any>(`${baseURL}/miqaat`, {
      headers: this.getHeaders(),
    });
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${baseURL}/miqaat/${id}`, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, data: any): Observable<any> {
    return this.httpClient.put<any>(`${baseURL}/miqaat/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${baseURL}/miqaat/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateApprovalStatus(id: number, status: string): Observable<any> {
    return this.httpClient.patch<any>(
      `${baseURL}/miqaat/${id}/approval`,
      { status: status },
      { headers: this.getHeaders() }
    );
  }
}
