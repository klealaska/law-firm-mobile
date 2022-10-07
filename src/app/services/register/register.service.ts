import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private getEndpointUGroups = "userGroups/getAll";
  private getEndpointUCategories = "userCategories/getAll";
  private postEndpoint = "user/register/web";

  constructor(private apiService: ApiService) { }

  getUserGroups() {
    return this.apiService.get(this.getEndpointUGroups);
  }

  getUserCategories() {
    return this.apiService.get(this.getEndpointUCategories);
  }

  postRegister(data) {
    return this.apiService.post(this.postEndpoint, data);
  }
}
