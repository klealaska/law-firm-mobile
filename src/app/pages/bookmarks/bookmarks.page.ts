import { Component, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {
  bookmarks = new Array();

  constructor(
    private bookmarksService: BookmarksService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.presentLoading();
    this.getAllBookMarks();
    this.loadingService.dismissLoading();
  }

  getAllBookMarks() {
    this.bookmarksService.getAllBookmarks().subscribe((bookmarks: any) => {
      this.bookmarks = bookmarks.body;
      this.bookmarks.forEach(bookmark => {
        bookmark.url = `/${bookmark.url}`;
      });
    });
  }

  deleteBookmark(id) {
    this.loadingService.presentLoading();
    this.bookmarksService.deleteBookMark(id).subscribe(() => {
      this.toastService.presentToast('Bookmark removed');
      this.getAllBookMarks();
    });
    this.loadingService.dismissLoading();
  }
}
