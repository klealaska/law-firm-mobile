import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { TagsComponent } from 'src/app/components/tags/tags.component';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.page.html',
  styleUrls: ['./blog-post-view.page.scss'],
})
export class BlogPostViewPage implements OnInit {
  subscribe;
  id;
  imageUrl;
  profileImgUrl;
  threadId;
  commentThreads: any = new Array<any>();
  public blogPostComments: any;
  public comments = new Array<any>();
  public title = '';
  public publishedDate = new Date();
  public publishedBy = '';
  public description = '';
  public tagList = new Array<any>();
  public authors = new Array();
  public authorsNameArray = new Array();
  public attachments = new Array();
  public bannerData;
  authorsName;
  commentContent: string;
  replyCommentContent: string;
  newComment;
  replyComment;
  userEmail;
  hasUpvoted: boolean;
  editMode: boolean = false;
  editCommentContent;
  editReplyContent;
  showCommentInput: boolean;
  showReplyInput: boolean;
  index: number;
  deleted: any;
  colorOverlay: any;
  canEdit: boolean = true;
  canEditReply: boolean = true;
  firstName: any;
  lastName: any;
  paginationModel: PaginationModel = {
    TotalItems: 0,
    PageNumber: 0,
    PageSize: 0,
  };

  constructor(
    private blogPostService: BlogPostService,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadingService.presentLoading();
    this.subscribe = this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getBlogPostItem();
      if (this.userService.isLoggedIn()) {
        this.getCurrentUserData();
      }
      this.getBlogPostComments();
    });
    this.loadingService.dismissLoading();
  }

  getBlogPostItem() {
    this.blogPostService.getById(this.id).subscribe(async (res: any) => {
      this.title = res.title;
      this.publishedDate = res.publishedDate;
      this.publishedBy = res.createdBy;
      this.description = res.description;
      this.tagList = res.blogPostTags;
      this.authors = res.authors;
      this.attachments = res.attachmentUrls;
      if (res.imageUrl != null) {
        this.imageUrl = res.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      } else {
        this.imageUrl = await this.getBlogPostBannerImage();
      }
    });
  }

  async getBlogPostBannerImage() {
    this.bannerData = await this.blogPostService.getBlogPostsBannerImage().toPromise();
    this.colorOverlay = this.bannerData.colorOverlay;
    return this.bannerData.imageUrl;
  }

  openCommentInput() {
    this.showCommentInput = !this.showCommentInput;
  }

  openReplyInput(index: number) {
    this.index = index;
    this.replyCommentContent = '';
    this.showReplyInput = !this.showReplyInput;
    if (this.userEmail === undefined) {
      this.router.navigate(['login']);
    }
  }

  getCurrentUserData() {
    this.userService.getProfile().subscribe((res: any) => {
      this.userEmail = res.email;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      if (res.imagePath != null) {
        this.profileImgUrl = res.imagePath.split('\\').join('/').replace("https://localhost:44357", "https://192.168.1.69:45455");
      } else {
        this.profileImgUrl = null;
      }
    });
  }

  getBlogPostComments() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService.getBlogPostComments(this.id, paginate).subscribe((data: any) => {
      if (data != null) {
        this.blogPostComments = data.body;
        this.commentThreads.push(data.body.commentThreads);
        if (data.commentThreads != null) {
          data.commentThreads.forEach(commentThread => {
            if (commentThread.comment.avatar != null || commentThread.comment.avatar != undefined) {
              commentThread.comment.avatar = commentThread.comment.avatar.replace("https://localhost:44357", "https://192.168.1.69:45455");
            } else {
              commentThread.comment.avatar = null;
            }
            commentThread.comment.replies.forEach(reply => {
              if (reply.avatar != null || reply.avatar != undefined) {
                reply.avatar = reply.avatar.replace("https://localhost:44357", "https://192.168.1.69:45455");
              } else {
                reply.avatar = null;
              }
            });
            if (commentThread.comment.upvotes.length != 0) {
              if (commentThread.comment.upvotes.includes(this.userEmail)) {
                commentThread.comment.hasUpvoted = true;
              }
            }
            else {
              commentThread.comment.hasUpvoted = false;
            }
            commentThread.comment.replies.forEach(reply => {
              if (reply.upvotes.length != 0) {
                if (reply.upvotes.includes(this.userEmail)) {
                  reply.hasUpvoted = true;
                }
                else { reply.hasUpvoted = false; }
              }
              else {
                reply.hasUpvoted = false;
              }
            });
          });
        }
      } else {
        this.commentThreads[0] = new Array();
      }
    });
  }

  async onComment() {
    const data = {
      blogPostId: this.id,
      threadId: "",
      content: this.commentContent,
      parentId: ""
    };
    var res: any = await this.blogPostService.postAddComment(data).toPromise();
    if (res.comment.avatar == null || res.comment.avatar == undefined) {
      res.comment.avatar = null;
    } else {
      res.comment.avatar = res.comment.avatar.replace("https://localhost:44357", "https://192.168.1.69:45455");
    }
    this.newComment = res;
    this.commentThreads[0].unshift(this.newComment);
    this.commentContent = '';
  }

  async onReplyComment(commentThreadId, parentId) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      content: this.replyCommentContent,
      parentId: parentId
    }
    var res: any = await this.blogPostService.postAddComment(data).toPromise();
    if (res.comment.avatar == null || res.comment.avatar == undefined) {
      res.comment.avatar = null;
    } else {
      res.comment.avatar = res.comment.avatar.replace("https://localhost:44357", "https://192.168.1.69:45455");
    }
    this.replyComment = res.comment;
    this.commentThreads[0].forEach(element => {
      if (element.id == commentThreadId) {
        element.comment.replies.unshift(this.replyComment);
      }
    });
    this.replyCommentContent = '';
    this.showReplyInput = false;
  }

  deleteComment(commentThreadId, commentId) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      parentId: "",
      commentId: commentId
    }
    this.blogPostService.deleteComment(data).subscribe(() => {
      this.commentThreads[0].forEach(element => {
        if (element.id == commentThreadId) {
          this.commentThreads[0] = this.commentThreads[0].filter((item) => item.id !== element.id);
          return this.commentThreads[0];
        }
      });
      this.toastService.presentToast("Comment deleted successfully")
    }
    );
  }

  deleteReplyComment(commentThreadId, commentId, replyCommentId) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      parentId: commentId,
      commentId: replyCommentId
    };
    this.blogPostService.deleteComment(data).subscribe(() => {
      this.commentThreads[0].forEach(element => {
        if (element.id === commentThreadId) {
          element.comment.replies.forEach(item => {
            var index = null;
            if (item.id === replyCommentId) {
              index = element.comment.replies.indexOf(item);
              element.comment.replies.splice(index, 1);
            }
          });
        }
      });
      this.toastService.presentToast('Comment deleted successfully');
      return this.commentThreads[0];
    });
  }

  async upvote(commentThreadId, comment, parent) {
    const data = {
      commentId: comment.id,
      threadId: commentThreadId,
      blogPostId: this.id,
      parentId: (parent == 0) ? null : parent
    };
    var res: any = await this.blogPostService.voteComment(data).toPromise();
    if (res) {
      var up = comment.upvotes.includes(this.userEmail)
      if (!up) {
        comment.hasUpvoted = true;
        comment.upvotes.unshift(this.userEmail);
      }
      else {
        comment.hasUpvoted = false;
        comment.upvotes.shift(this.userEmail);
      }
    }
  }

  async openCommentAlert(commentThreadId, comment) {
    const alert = await this.alertCtrl.create({
      cssClass: 'navigate-alert',
      mode: 'ios',
      buttons: [{
        text: 'Edit',
        handler: () => this.showEditCommentSection(comment)
      },
      {
        text: 'Delete',
        handler: () => this.deleteComment(commentThreadId, comment.id)
      }]
    });
    await alert.present();
    await alert.onDidDismiss();

  }

  async openReplyAlert(commentThreadId, commentId, reply) {
    const alert = await this.alertCtrl.create({
      cssClass: 'navigate-alert',
      mode: 'ios',
      buttons: [{
        text: 'Edit',
        handler: () => this.showEditReplySection(reply)
      },
      {
        text: 'Delete',
        handler: () => this.deleteReplyComment(commentThreadId, commentId, reply.id)
      }]

    });
    await alert.present();
    await alert.onDidDismiss();

  }

  async showEditCommentSection(comment) {
    comment.editMode = true;
    this.editCommentContent = comment.content;
    this.canEdit = false;
  }
  async showEditReplySection(reply) {
    reply.editMode = true;
    this.editReplyContent = reply.content;
    this.canEditReply = false;
  }

  async onUpdateComment(comment, thread, parent) {
    const data = {
      blogPostId: this.id,
      threadId: thread,
      commentId: comment.id,
      content: (parent != 0) ? this.editReplyContent : this.editCommentContent,
      parentId: (parent == 0) ? null : parent
    };
    var res: any = await this.blogPostService.updateComment(data).toPromise();
    if (res) {
      if (parent == 0) {
        let updateItem = this.commentThreads[0].find(x => x.comment.id == comment.id);
        updateItem.comment.content = this.editCommentContent;
        this.editCommentContent = "";
        comment.editMode = false;
        this.canEdit = true;
      }
      else {
        var updatedcomment = this.commentThreads[0].find(x => x.comment.id == parent);
        let reply = updatedcomment.comment.replies.find(x => x.id == comment.id)
        reply.content = this.editReplyContent;
        this.editReplyContent = "";
        reply.editMode = false;
        this.canEditReply = true;
      }
    }
  }

  openTagsModal(tag) {
    this.presentModal(tag);
  }

  async presentModal(tag) {
    const modal = await this.modalController.create({
      component: TagsComponent,
      componentProps: { tag: tag }
    });
    return await modal.present();
  }
}
