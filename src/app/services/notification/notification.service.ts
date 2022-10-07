import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InternalObservableService } from '../internal-observable/internal-observable.service';
import { StorageService } from '../storage/storage.service';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;

  constructor(
    private storageService: StorageService,
    private internalObservablesService: InternalObservableService
  ) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'hubs/notifications', { accessTokenFactory: () => this.storageService.getAuthToken() })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started (signalR)'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public listenToNotifications = () => {
    this.hubConnection.on('notificationCreated', (data) => {
      this.internalObservablesService.notificationSubject.next(data)
    });
  }
}
