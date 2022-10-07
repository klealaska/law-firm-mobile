import { Injectable } from '@angular/core';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  private getAllBookmarksEndpoint = 'bookmarks/getAll';
  private addBookMarkEndpoint = 'bookmarks/add';
  private deleteBookmarkEndpoint = 'bookmarks/remove';
  language: string;


  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getAllBookmarks() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getAllBookmarksEndpoint}`);
    } else {
      return this.apiService.get(this.getAllBookmarksEndpoint);
    }
  }

  addBookmark(data) {
    return this.apiService.post(this.addBookMarkEndpoint, data);
  }
  deleteBookMark(id) {
    return this.apiService.get(this.deleteBookmarkEndpoint + '/' + id);
  }
}
