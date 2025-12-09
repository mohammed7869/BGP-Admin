import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/api/1/appointment`;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/get/all`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/book`, data);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/get/${id}`);
  }

  reschedule(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/reschedule`, data);
  }

  archive(id: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/archive`, id);
  }

  cancel(id: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/cancel`, id);
  }

  updateFields(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/updateFields`, data);
  }

  getBookedSlots(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/booked/slots`, data);
  }

  updateNote(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update/note`, data);
  }

  updateContact(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/update/contact`, data);
  }

  confirmAppointment(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/confim`, id);
  }
  
}
