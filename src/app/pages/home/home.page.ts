import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LawGroupEnum } from 'src/app/enums/lawGroupEnum';
import { HomeService } from 'src/app/services/home/home.service';
import { LawService } from 'src/app/services/law/law.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public homeData: any;
  public lawData = new Array();
  public imageUrl: any;
  public taxNews = <any>{};
  public videos = new Array();
  @ViewChildren('video') el: QueryList<any>;
  tree = new Array();
  fiscalLegislationgroupCode: any;
  fiscalLegislationlawCode: any;
  fiscalLegislationarticleCode: any;
  customsLegislationgroupCode: any;
  customsLegislationlawCode: any;
  customsLegislationarticleCode: any;
  accountingStandardsgroupCode: any;
  accountingStandardslawCode: any;
  accountingStandardsarticleCode: any;
  laborCodegroupCode: any;
  laborCodelawCode: any;
  laborCodearticleCode: any;

  constructor(
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private router: Router,
    private lawService: LawService
  ) { }

  async ngOnInit() {
    this.loadingService.presentLoading();
    this.getHomeData();
    await this.getSideBarTree();
    this.loadingService.dismissLoading();
  }

  getHomeData() {
    this.homeService.getAll().subscribe((result: any) => {
      this.homeData = result;
      this.lawData = this.homeData.laws;
      this.lawData.forEach(lawData => {
        lawData.imageUrl = lawData.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      })
      this.taxNews = this.homeData.taxNews;
      this.taxNews.imageUrl = this.taxNews.imageUrl.replace("https://localhost:44357", "https://192.168.1.69:45455");
      this.videos = this.homeData.videos;
      this.videos.forEach(res => {
        if (res.link != null) {
          res.link = this.sanitizer.bypassSecurityTrustResourceUrl(res.link.replace("youtu.be", "youtube.be/embed").concat("?enablejsapi=1"));
        }
      });
    });
  }

  async getSideBarTree() {
    let result: any = await this.lawService.getSidebarTree();
    result.forEach(node => {
      this.tree.push(node);
    });
    this.tree.forEach((node) => {
      if (node.code === LawGroupEnum.group1Al || node.code === LawGroupEnum.group1En) {
        this.fiscalLegislationgroupCode = node.code;
        this.fiscalLegislationlawCode = node.children[0].code;
        this.fiscalLegislationarticleCode = node.children[0].children[0].code;
      } else if (node.code === LawGroupEnum.group4Al || node.code === LawGroupEnum.group4En) {
        if (node.children[0] != null) {
          this.customsLegislationgroupCode = node.code;
          this.customsLegislationlawCode = node.children[0].code;
          this.customsLegislationarticleCode = node.children[0].children[0].code;
        }
      } else if (node.code === LawGroupEnum.group2Al || node.code === LawGroupEnum.group2En) {
        if (node.children[0] != null) {
          this.accountingStandardsgroupCode = node.code;
          this.accountingStandardslawCode = node.children[0].code;
          this.accountingStandardsarticleCode = node.children[0].children[0].code;
        }
      } else if (node.code === LawGroupEnum.group3Al || node.code === LawGroupEnum.group3En) {
        if (node.children[0] != null) {
          this.laborCodegroupCode = node.code;
          this.laborCodelawCode = node.children[0].code;
          this.laborCodearticleCode = node.children[0].children[0].code;
        }
      }
    });
  }

  openChapter(lawName) {
    switch (lawName) {
      case LawGroupEnum.law1Name:
        if (this.fiscalLegislationgroupCode != null && this.fiscalLegislationlawCode != null && this.fiscalLegislationarticleCode != null) {
          return this.router.navigateByUrl(`/laws/${this.fiscalLegislationgroupCode}/${this.fiscalLegislationlawCode}/${this.fiscalLegislationarticleCode}`);
        }
      case LawGroupEnum.law2Name:
        if (this.accountingStandardsgroupCode != null && this.accountingStandardslawCode != null && this.accountingStandardsarticleCode != null) {
          return this.router.navigateByUrl(`/laws/${this.accountingStandardsgroupCode}/${this.accountingStandardslawCode}/${this.accountingStandardsarticleCode}`);
        }
      case LawGroupEnum.law3Name:
        if (this.laborCodegroupCode != null && this.laborCodelawCode != null && this.laborCodearticleCode != null) {
          return this.router.navigateByUrl(`/laws/${this.laborCodegroupCode}/${this.laborCodelawCode}/${this.laborCodearticleCode}`);
        }
      case LawGroupEnum.law4Name:
        if (this.customsLegislationgroupCode != null && this.customsLegislationlawCode != null && this.customsLegislationarticleCode != null) {
          return this.router.navigateByUrl(`/laws/${this.customsLegislationgroupCode}/${this.customsLegislationlawCode}/${this.customsLegislationarticleCode}`);
        }
      default:
        return this.router.navigateByUrl(`/home`);
    }
  }

  slideChanged() {
    this.el.forEach((el) => {
      el.nativeElement.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    });
  }

  goToTaxNews() {
    this.router.navigate(['tax-news']);
  }

  goToVideosPage() {
    this.router.navigate(['videos'])
  }

}
