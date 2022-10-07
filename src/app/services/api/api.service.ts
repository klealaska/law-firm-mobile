import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  get(uri: string) {
    return this.httpClient.get(`${environment.apiUrl}${uri}`);
  }

  post(uri: string, data: any) {
    return this.httpClient.post(`${environment.apiUrl}` + uri, data);
  }

  put(uri: string, data: any) {
    return this.httpClient.put(`${environment.apiUrl}` + uri, data);
  }

  deleteRequest(uri: string, data: any) {
    return this.httpClient.delete(`${environment.apiUrl}${uri}`, data);
  }
}
