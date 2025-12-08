import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordCreationService {

  // Observable any sources
  private insertSource = new Subject<any>();
  private updateSource = new Subject<any>();
  private readNotificationSource = new Subject<any>();
  private readAllNotificationSource = new Subject<any>();
  private updateImageSource = new Subject<any>();

  // Observable any streams
  recordInserted$ = this.insertSource.asObservable();
  recordUpdated$ = this.updateSource.asObservable();
  readNotificationUpdated$ = this.readNotificationSource.asObservable();
  readAllNotificationUpdated$ = this.readAllNotificationSource.asObservable();
  recordImageUpdated$ = this.updateImageSource.asObservable();

  // Service message commands
  announceInsert(record: any) {
    this.insertSource.next(record);
  }

  announceUpdate(record: any) {
    this.updateSource.next(record);
  }

  announceReadNotification(record: any) {
    this.readNotificationSource.next(record);
  }

  announceReadAllNotification() {
    this.readAllNotificationSource.next();
  }

  announceImageUpdate(record: any) {
    this.updateImageSource.next(record);
  }
}

