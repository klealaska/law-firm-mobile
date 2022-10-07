import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { LawService } from 'src/app/services/law/law.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
})
export class VersionsComponent implements OnInit {
  lawId;
  articleVersionsList = new Array();
  accordionPaginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  paginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  panelOpenState = false;
  displayedColumns: string[] = ['index', 'description'];
  dataSource;

  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

  constructor(
    public navParams: NavParams,
    private lawsService: LawService,
    private modalController: ModalController,
    private loadingService: LoadingService
  ) {
    this.lawId = this.navParams.data.lawId;
  }

  async ngOnInit() {
    this.loadingService.presentLoading();
    let pagination = new Pagination(this.accordionPaginationModel);
    let data: any = await this.lawsService.getLawArticleVersionsAndDetails(this.lawId, pagination).toPromise();
    this.setPagination = data;
    console.log(data);
    console.log(this.paginationModel.PageSize, "page size");
    this.articleVersionsList = data.body;
    this.loadingService.dismissLoading();
  }

  goToArticle(articleLink) {
    return location.href = articleLink;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
