import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
} 