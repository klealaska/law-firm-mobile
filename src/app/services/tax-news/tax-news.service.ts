import { Injectable } from '@angular/core';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaxNewsService {
  private getTaxNewsBannerEndpoint = 'homePageLawConfiguration/getTaxNewsConfiguration';
  private getTaxNews = 'taxNews/getAll';
  language: string = LanguageEnum.Albanian;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getTaxNewsBanner() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getTaxNewsBannerEndpoint}`);
    } else {
      return this.apiService.get(this.getTaxNewsBannerEndpoint);
    }
  }
  getNews() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getTaxNews}`);
    } else {
      return this.apiService.get(this.getTaxNews);
    }
  }
}
