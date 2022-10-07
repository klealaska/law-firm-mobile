import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.page.html',
  styleUrls: ['./blog-posts.page.scss'],
})
export class BlogPostsPage implements OnInit {
  public latestBlogPosts = new Array();
  public popularBlogPosts = new Array();
  public onYourInterest = new Array();
  public blogPostBanner: any;
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 0, PageSize: 0 };
  image;
  color;
  description;
  title;

  constructor(private blogPostService: BlogPostService,
    public userService: UserService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.presentLoading();
    this.getBlogPostBanner();
    this.getLatestBlogPosts();
    this.getPopularBlogPosts();
    if (this.userService.isLoggedIn()) {
      this.getOnYourInterest();
    }
    this.loadingService.dismissLoading();
  }

  getBlogPostBanner() {
    this.blogPostService.getBlogPostsBanner().subscribe((res: any) => {
      if (res.imageUrl != null) {
        this.image = res.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      }
      this.color = res.colorOverlay;
      this.description = res.description;
      this.title = res.title;
    });
  }

  getLatestBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService.getLatestBlogPost(paginate).subscribe((res: any) => {
      this.latestBlogPosts = res.body.slice(0, 3);
      if (this.latestBlogPosts.length > 0) {
        this.latestBlogPosts.forEach(latest => {
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
      this.popularBlogPosts = res.body.slice(0, 6);
      if (this.popularBlogPosts.length > 0) {
        this.popularBlogPosts.forEach(popular => {
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
      this.onYourInterest = res.body.slice(0, 6);
      if (this.onYourInterest.length > 0) {
        this.onYourInterest.forEach(interest => {
          if (interest.imageUrl != null) {
            interest.imageUrl = interest.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
          }
        });
      }
    });
  }
}