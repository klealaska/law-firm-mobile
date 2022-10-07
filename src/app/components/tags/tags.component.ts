import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  tagId: { [key: string]: any; };
  tagName: any;
  public currentBlogPostList = new Array();
  public blogPostList = new Array();
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 1, PageSize: 5 };
  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    private blogPostService: BlogPostService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.tagId = this.navParams.data.tag.tagId;
    this.tagName = this.navParams.data.tag.name;
  }

  async ngOnInit(): Promise<void> {
    this.loadingService.presentLoading();
    await this.getBlogPost();
    this.loadingService.dismissLoading();
  }

  async getBlogPost() {
    let paginate = new Pagination(this.paginationModel);
    let blogPostList: any = await this.blogPostService.getBlogPostsPerTag(this.tagId, paginate).toPromise();
    this.currentBlogPostList = blogPostList.body;
    if (this.currentBlogPostList.length == 0) {
      this.loadingService.dismissLoading();
    }
    this.currentBlogPostList.forEach(item => {
      if (item.imageUrl != null) {
        item.imageUrl = item.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      }
    });
  }

  loadData(event) {
    this.paginationModel.PageNumber++;
    let paginate = new Pagination(this.paginationModel);
    setTimeout(() => {
      this.blogPostService.getBlogPostsPerTag(this.tagId, paginate)
        .subscribe(
          (res: any) => {
            this.setPagination = res;
            for (let i = 0; i < res.body.length; i++) {
              this.currentBlogPostList.push(res.body[i]);
              this.currentBlogPostList.forEach(interest => {
                if (interest.imageUrl != null) {
                  interest.imageUrl = interest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
                }
              });
            }
            event.target.complete();
            if (this.currentBlogPostList.length == this.paginationModel.TotalItems) {
              event.target.disabled = true;
            }
          });
    }, 500);
  }

  openBlogPost(id) {
    this.router.navigateByUrl(`/blog-post-view/${id}`);
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}


