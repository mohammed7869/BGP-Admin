import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/api/1`;

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(private httpClient: HttpClient) { }

  // Get all insurance providers
  getAllInsurance(): Observable<any> {
    return this.httpClient.get(`${baseURL}/insurance/list`);
  }

  // Update insurance information for an appointment
  updateInsuranceInfo(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/appointment/update/insurance-info`, data);
  }

  // Delete insurance information for an appointment
  deleteInsuranceInfo(appointmentId: number): Observable<any> {
    return this.httpClient.delete(`${baseURL}/appointment/delete/insurance-info/${appointmentId}`);
  }
}
