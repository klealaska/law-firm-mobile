import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private postSearchEndpoint = 'search/search';
  searchText;
  private results = new BehaviorSubject([]);
  public getResults$() {
    return this.results;
  }
  constructor(private apiService: ApiService) { }

  postSearch(data) {
    return this.apiService.post(this.postSearchEndpoint, data);
  }

  public getSuggestion(data: any) {
    this.results.next(data);
  }
}
