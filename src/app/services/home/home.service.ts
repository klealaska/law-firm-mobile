import { Injectable } from '@angular/core';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private getEndpoint = "homePageLawConfiguration/getVisibleConfigurations";
  private getAllVideosEndpoint = 'HomepageVideo/getAll';
  private language: string;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getAll() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getEndpoint}`);
    } else {
      return this.apiService.get(this.getEndpoint);
    }
  }

  getAllVideos() {
    return this.apiService.get(this.getAllVideosEndpoint);
  }
}
