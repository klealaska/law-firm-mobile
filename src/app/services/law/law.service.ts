import { Injectable } from '@angular/core';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { Pagination } from 'src/app/interfaces/Pagination';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LawService {
  private getLawCategoriesEndpoint = 'lawCategories/GetSidebarTree';
  private getChapterWithSectionsEndpoint = 'lawCategories/getChapterWithSectionsByChapterCode';
  private getLawCategoryByIdEndpoint = 'lawCategories/getById';
  private getHyperlinksEndpoint = 'HyperLink/GetAll';
  private setHyperLinksEndpoint = 'HyperLink/Setlinks';
  private getLawArticleRelatedLinksBySectionIdEndpoint = 'lawArticleRelatedLinks/getLawArticleRelatedLinksBySectionId';
  private getLawArticleVersionsAndDetailsEndpoint = 'LawArticleVersions/GetLawArticleVersionsAndDetails';
  code;
  groupCode;
  lawCode;
  language: string = LanguageEnum.Albanian;
  sidebarTreeData = new Array();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getLawCategories() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getLawCategoriesEndpoint}`);
    } else {
      return this.apiService.get(`${this.getLawCategoriesEndpoint}`);
    }
  }

  getChapterWithSections(code) {
    return this.apiService.get(this.getChapterWithSectionsEndpoint + '/' + code);
  }

  getLawCategoryById(id) {
    return this.apiService.get(this.getLawCategoryByIdEndpoint + '/' + id);
  }

  getHyperLinksByLawId(id?, language?) {
    let url = `${this.getHyperlinksEndpoint}`;
    if (id != null) {
      url = `${url}?id=${id}`;
    }
    if (language != null) {
      url = `${language}/${url}`;
    }
    return this.apiService.get(url);
  }

  setHyperlinks(data) {
    return this.apiService.post(this.setHyperLinksEndpoint, data);
  }

  getLawArticleRelatedLinksBySectionId(id, pagination?: Pagination) {
    let url = `${this.getLawArticleRelatedLinksBySectionIdEndpoint}`;
    if (id != null) {
      url = `${url}?id=${id}&`;
    } else {
      url = `${url}?`;
    }
    if (this.language != null) {
      url = `${this.language}/${url}`;
    }
    if (pagination != null) {
      url = `${url}$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getLawArticleVersionsAndDetails(id, pagination?) {
    let url = `${this.language}/${this.getLawArticleVersionsAndDetailsEndpoint}`;
    if (id != null) {
      url = `${url}?lawId=${id}&`;
    } else {
      url = `${url}?`;
    }
    if (pagination != null) {
      url = `${url}$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }
  //#region Storage Data

  async getSidebarTree() {
    let sidebarTreeData = JSON.parse(this.storageService.getStorage(StorageLabelsEnum.sidebarTree));
    if (sidebarTreeData != null) {
      if (sidebarTreeData.language == this.language) {
        return sidebarTreeData.result;
      } else {
        let result = await this.getLawCategories().toPromise();
        this.setSidebarTreeState(result);
        return result;
      }
    } else {
      let result = await this.getLawCategories().toPromise();
      this.setSidebarTreeState(result);
      return result;
    }
  }

  private setSidebarTreeState(result) {
    this.storageService.removeStorage(StorageLabelsEnum.sidebarTree);
    let state = {
      language: this.language,
      result: result
    }
    this.storageService.setStorage(StorageLabelsEnum.sidebarTree, JSON.stringify(state));
  }
  //#endregion
}
