import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/interfaces/Pagination';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private getBlogPostBannerEndpoint = 'homePageLawConfiguration/getBlogPostConfiguration';
  private getPopularBlogPostsEndpoint = 'blogPosts/getPopularBlogPosts';
  private getLatestBlogPostEndpoint = 'BlogPosts/GetAllLatest';
  private getBlogPostOfYourInterestEndpoint = 'BlogPosts/GetBlogPostOfYourInterest';
  private getByIdEndpoint = 'blogPosts/getById';
  private getBlogPostCommentsEndpoint = 'blogPosts';
  private postAddCommentEndPoint = 'blogPosts/addComment';
  private deleteCommentEndpoint = 'BlogPosts/DeleteComment';
  private voteCommentEndpoint = 'blogPosts/VoteComment';
  private putUpdateCommentsEndpoint = 'blogPosts/updateComment';
  private getTagByIdEndpoint = 'blogPosts/GetBlogPostsPerTag';
  language: string = LanguageEnum.Albanian;
  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getBlogPostsBanner() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getBlogPostBannerEndpoint}`);
    } else {
      return this.apiService.get(this.getBlogPostBannerEndpoint);
    }
  }

  getLatestBlogPost(pagination?: Pagination) {
    let url = this.getLatestBlogPostEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getPopularBlogPosts(pagination?: Pagination) {
    let url = this.getPopularBlogPostsEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getBlogPostOfYourInterest(pagination?: Pagination) {
    let url = this.getBlogPostOfYourInterestEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  getBlogPostsBannerImage() {
    return this.apiService.get(this.getBlogPostBannerEndpoint);
  }

  getBlogPostComments(blogPostId, pagination?: Pagination) {
    let url = this.getBlogPostCommentsEndpoint;
    if (pagination != null) {
      url = `${url}/${blogPostId}/getComments?skip=${pagination.Skip}&top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  postAddComment(data) {
    return this.apiService.post(this.postAddCommentEndPoint, data);
  }

  deleteComment(data) {
    return this.apiService.post(this.deleteCommentEndpoint, data);
  }

  voteComment(data) {
    return this.apiService.put(this.voteCommentEndpoint, data);
  }

  updateComment(data) {
    return this.apiService.put(this.putUpdateCommentsEndpoint, data);
  }

  getBlogPostsPerTag(tagId, pagination) {
    let url = this.getTagByIdEndpoint;
    if (pagination != null) {
      url = `${url}/${tagId}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }
}
