import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { LawService } from 'src/app/services/law/law.service';
import { LoadingService } from 'src/app/services/loading/loading.service';


@Component({
  selector: 'app-related-links',
  templateUrl: './related-links.component.html',
  styleUrls: ['./related-links.component.scss'],
})
export class RelatedLinksComponent implements OnInit {
  articleId;
  relatedLinks = new Array();
  paginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    private lawsService: LawService,
    private loadingService: LoadingService) {
    this.articleId = this.navParams.data.articleId;

  }

  async ngOnInit() {
    this.loadingService.presentLoading();
    let pagination = new Pagination(this.paginationModel);
    let relatedLinks: any = await this.lawsService.getLawArticleRelatedLinksBySectionId(this.articleId, pagination).toPromise();
    this.setPagination = relatedLinks;
    this.relatedLinks = relatedLinks.body;
    this.loadingService.dismissLoading();
  }

  openLink(link) {
    location.href = link;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
