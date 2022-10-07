import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternalObservableService {
  public notificationSubject = new Subject()
  constructor() { }
}
