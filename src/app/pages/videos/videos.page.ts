import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from 'src/app/services/home/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HomePageRoutingModule } from '../home/home-routing.module';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
  public videos = new Array();

  constructor(
    private homeService: HomeService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService) { }

  ngOnInit() {
    this.loadingService.presentLoading();
    this.getAllVideos();
    this.loadingService.dismissLoading();
  }

  getAllVideos() {
    this.homeService.getAllVideos().subscribe((res: any) => {
      this.videos = res.body;
      this.videos.forEach(res => {
        if (res.link != null) {
          res.link = this.sanitizer.bypassSecurityTrustResourceUrl(res.link.replace("youtu.be", "youtube.be/embed").concat("?enablejsapi=1"));
        }
      });
    }, () => {
      this.toastService.presentToast('Error! Cannot load videos, try again later.');
    })
  }
}
