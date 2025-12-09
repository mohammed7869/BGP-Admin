import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
    
  public getItem(key: string){ 
    return JSON.parse(localStorage.getItem(key) || '{}')
  }

  public removeItem(key:string) {
    localStorage.removeItem(key);
  }

  public clear(){
    localStorage.clear(); 
  }

  public setSessionItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
    
  public getSessionItem(key: string){ 
    return JSON.parse(sessionStorage.getItem(key) || '{}')
  }

  public removeSessionItem(key:string) {
    sessionStorage.removeItem(key);
  }
}