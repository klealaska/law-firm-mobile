import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogEnum } from 'src/app/enums/blogEnum';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.page.html',
  styleUrls: ['./blog-post-list.page.scss'],
})
export class BlogPostListPage implements OnInit {
  subscribe: any;
  blogCategory: string;
  categoryName;
  public blogPostList = new Array();
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 1, PageSize: 5 };
  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogPostService: BlogPostService,
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscribe = this.activatedRoute.paramMap.subscribe(params => {
      this.blogCategory = params.get('category');
      if (this.blogCategory == 'latest') {
        this.getLatestBlogPosts();
        this.categoryName = BlogEnum.Latest;
      } else if (this.blogCategory == 'interest' && this.userService.isLoggedIn()) {
        this.getOnYourInterest();
        this.categoryName = BlogEnum.Interest;
      } else if (this.blogCategory == 'popular') {
        this.getPopularBlogPosts();
        this.categoryName = BlogEnum.Popular;
      } else {
        this.router.navigate(['login']);
      }
    });

  }
  getLatestBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService.getLatestBlogPost(paginate).subscribe((res: any) => {
      this.setPagination = res;
      this.blogPostList = res.body;
      if (this.blogPostList.length > 0) {
        this.blogPostList.forEach(latest => {
          if (latest.imageUrl != null) {
            latest.imageUrl = latest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
          }
        });
      }
    });
  }

  getPopularBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService.getPopularBlogPosts(paginate).subscribe((res: any) => {
      this.blogPostList = res.body;
      if (this.blogPostList.length > 0) {
        this.blogPostList.forEach(popular => {
          if (popular.imageUrl != null) {
            popular.imageUrl = popular.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
          }
        });
      }
    });
  }

  getOnYourInterest() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService.getBlogPostOfYourInterest(paginate).subscribe((res: any) => {
      this.blogPostList = res.body;
      if (this.blogPostList.length > 0) {
        this.blogPostList.forEach(interest => {
          if (interest.imageUrl != null) {
            interest.imageUrl = interest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
          }
        });
      }
    });
  }

  loadData(event) {
    if (this.blogCategory == 'latest') {
      this.loadLatest(event);
    } else if (this.blogCategory == 'popular') {
      this.loadPopular(event)
    }
    else {
      this.loadInterest(event);
    }


  }

  loadLatest(event) {
    this.paginationModel.PageNumber++;
    let paginate = new Pagination(this.paginationModel);
    setTimeout(() => {
      this.blogPostService.getLatestBlogPost(paginate)
        .subscribe(
          (res: any) => {
            this.setPagination = res;
            for (let i = 0; i < res.body.length; i++) {
              this.blogPostList.push(res.body[i]);
              this.blogPostList.forEach(latest => {
                if (latest.imageUrl != null) {
                  latest.imageUrl = latest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
                }
              });
            }
            event.target.complete();
            if (this.blogPostList.length == this.paginationModel.TotalItems) {
              event.target.disabled = true;
            }
          });
    }, 500);
  }

  loadPopular(event) {
    this.paginationModel.PageNumber++;
    let paginate = new Pagination(this.paginationModel);
    setTimeout(() => {
      this.blogPostService.getPopularBlogPosts(paginate)
        .subscribe(
          (res: any) => {
            this.setPagination = res;
            for (let i = 0; i < res.body.length; i++) {
              this.blogPostList.push(res.body[i]);
              this.blogPostList.forEach(popular => {
                if (popular.imageUrl != null) {
                  popular.imageUrl = popular.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
                }
              });
            }
            event.target.complete();
            if (this.blogPostList.length == this.paginationModel.TotalItems) {
              event.target.disabled = true;
            }
          });
    }, 500);
  }

  loadInterest(event) {
    this.paginationModel.PageNumber++;
    let paginate = new Pagination(this.paginationModel);
    setTimeout(() => {
      this.blogPostService.getBlogPostOfYourInterest(paginate)
        .subscribe(
          (res: any) => {
            this.setPagination = res;
            for (let i = 0; i < res.body.length; i++) {
              this.blogPostList.push(res.body[i]);
              this.blogPostList.forEach(interest => {
                if (interest.imageUrl != null) {
                  interest.imageUrl = interest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
                }
              });
            }
            event.target.complete();
            if (this.blogPostList.length == this.paginationModel.TotalItems) {
              event.target.disabled = true;
            }
          });
    }, 500);
  }

}