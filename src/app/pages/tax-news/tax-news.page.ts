import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TaxNewsService } from 'src/app/services/tax-news/tax-news.service';

@Component({
  selector: 'app-tax-news',
  templateUrl: './tax-news.page.html',
  styleUrls: ['./tax-news.page.scss'],
})
export class TaxNewsPage implements OnInit {
  public taxNewsData: any;
  public taxNewsBanner: any;
  description;
  title;
  lawName;
  imageUrl;
  colorOverlay;

  constructor(
    private taxNewsService: TaxNewsService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.getTaxNewsBanner();
    this.getTaxNews();
  }

  getTaxNewsBanner() {
    this.loadingService.presentLoading();
    this.taxNewsService.getTaxNewsBanner().subscribe((result: any) => {
      this.colorOverlay = result.colorOverlay;
      this.description = result.description;
      this.imageUrl = result.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      this.title = result.title;
      this.lawName = result.lawName;
    });
    this.loadingService.dismissLoading();
  }

  getTaxNews() {
    this.loadingService.presentLoading();
    this.taxNewsService.getNews().subscribe((res: any) => {
      this.taxNewsData = res.body;
      this.taxNewsData.forEach(res => {
        if (res.imageUrl != null) {
          res.imageUrl = 'data:image/png;base64,' + res.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
        }
      });
    });
    this.loadingService.dismissLoading();
  }

  setLink(taxNewsAttachments: Array<any>, language) {
    if (taxNewsAttachments.some(x => x.url != null) && taxNewsAttachments.some(x => x.language == language)) {
      return taxNewsAttachments.find(x => x.language == language).url;
    }
    else {
      return null;
    }
  }

}