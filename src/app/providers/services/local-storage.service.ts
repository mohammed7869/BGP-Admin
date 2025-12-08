import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private secretKey = 'fdee1aeb-1b7f-47c4-aa4a-da5c7951feb0';

  constructor() { }

  private encrypt(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return encryptedData;
  }

  private decrypt(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  public setItem(key: string, value: any) {
    const encryptedValue = this.encrypt(value);
    sessionStorage.setItem(key, encryptedValue);
  }

  public getItem(key: string) {
    const encryptedValue = sessionStorage.getItem(key);
    return encryptedValue ? this.decrypt(encryptedValue) : null;
  }

  public removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  public clear() {
    sessionStorage.clear();
  }
}
