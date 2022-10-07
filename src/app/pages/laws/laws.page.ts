import { AfterViewChecked, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ModalController, Platform, PopoverController } from '@ionic/angular';
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { RelatedLinksComponent } from 'src/app/components/related-links/related-links.component';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { LawService } from 'src/app/services/law/law.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { SearchService } from 'src/app/services/search/search.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { StorageService } from 'src/app/services/storage/storage.service';
import { VersionsComponent } from 'src/app/components/versions/versions.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-laws',
  templateUrl: './laws.page.html',
  styleUrls: ['./laws.page.scss'],
})
export class LawsPage implements OnInit, AfterViewChecked {
  subscribe;
  public chapterWithSections: any;
  groupName;
  categoryCode;
  categoryName;
  lawName: any;
  code;
  lawId;
  relatedLinks = new Array();
  groupCode: string;
  lawCode: string;
  fragment;
  articlesArray = new Array();
  articleLink: string;
  hyperLinks = new Array();
  pdfObj = null;
  searchResultArticles: any;
  public searchText: any;
  currentChapter: any;
  matchCount: number;
  public index: number = 0;
  searchConfig: any;
  firstMatchFromSearch;
  lastMatchFromSearch;
  howManyClicks: number = 0;
  searchedText;
  documents: NodeListOf<Element>;
  currentDocument: Element;
  language: string = LanguageEnum.Albanian;


  constructor(
    private lawService: LawService,
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private bookmarksService: BookmarksService,
    private toastService: ToastService,
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform,
    private searchService: SearchService,
    private router: Router,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document) {
    this.searchService.getResults$().subscribe((result: any) => {
      this.searchResultArticles = result;
      if (result.length > 0) {
        this.loadingService.presentLoading();
        this.searchText = result[0].sentence;
        setTimeout(() => {
          if (result[0].sentence.length != 0) {
            this.findFirstAndLastMatch();
            this.loadingService.dismissLoading();
          }
        }, 100);

      } else {
        this.searchText = "";
      }
    });
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }


  ngOnInit() {
    this.loadingService.presentLoading();
    this.subscribe = this.activatedRoute.paramMap.subscribe(async params => {
      this.code = params.get('code');
      this.groupCode = params.get('groupCode');
      this.lawCode = params.get('lawCode');
      this.lawService.lawCode = this.lawCode
      this.lawService.code = this.code;
      this.lawService.groupCode = this.groupCode;
      this.activatedRoute.fragment.subscribe((fragment) => {
        this.fragment = { urlFragment: fragment, fragmentCopy: fragment };
      });
      await this.getChapterWithSections();
      this.getLinks();
      this.loadingService.dismissLoading();
    });
  }

  ngAfterViewChecked() {
    this.scrollToAnchor(this.fragment.urlFragment);
  }

  scrollToAnchor(location) {
    var element: any = document.getElementById(location);
    if (element != null) {
      element.scrollIntoView();
      setTimeout(() => {
        this.fragment.urlFragment = null
      }, 1000)

    }
  }

  async presentPopover(ev: any) {
    this.loadingService.presentLoading();
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { articlesArray: this.articlesArray, groupCode: this.groupCode, lawCode: this.lawCode, code: this.code },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'md'
    });
    this.loadingService.dismissLoading();
    return await popover.present();

  }

  async getChapterWithSections() {
    this.articlesArray = new Array();
    this.chapterWithSections = new Array();
    let data: any = await this.lawService.getChapterWithSections(this.code).toPromise();
    data.forEach(element => {
      this.articlesArray.push(element);
    });
    this.groupName = await this.getLawGroupById(data[0].category.parent.parentId);
    data.forEach(article => {
      this.categoryName = article.category.name;
      this.categoryCode = article.category.code;
      this.lawName = article.category.parent.name;
      this.lawId = article.category.parentId;
      this.relatedLinks = article.relatedLinks;
    });
    this.chapterWithSections = data;
  }

  async getLawGroupById(id) {
    let lawGroupData: any = await this.lawService.getLawCategoryById(id).toPromise();
    return lawGroupData.name;
  }

  async openCopyAlert(link) {
    if (link === this.categoryCode) {
      this.articleLink = `${environment.clientUrl}laws/${this.groupCode}/${this.lawCode}/` + link;
    } else {
      this.articleLink = `${environment.clientUrl}laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + link;
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'copy-link',
      mode: 'ios',
      header: 'Copy Link',
      message: this.articleLink,
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  async openRelatedLinksAlert(articleId) {
    const modal = await this.modalController.create({
      component: RelatedLinksComponent,
      componentProps: { articleId: articleId }
    });
    return await modal.present();
  }

  async openVersionsModal(lawId) {
    const modal = await this.modalController.create({
      component: VersionsComponent,
      componentProps: { lawId: lawId }
    });
    return await modal.present();
  }

  addBookmark(article) {
    const data = {
      lawArticleId: article.id,
      code: article.code,
      lawArticleName: article.title,
      url: `laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + article.code,
      language: this.language
    };
    if (!article.isBookmarked) {
      this.bookmarksService.addBookmark(data).subscribe((res: any) => {
        this.chapterWithSections.find(x => x.id == data.lawArticleId).isBookmarked = res.isBookmarked;
      });
    } else {
      this.removeBookmark(data.lawArticleId);
    }
  }

  removeBookmark(id) {
    this.bookmarksService.deleteBookMark(id).subscribe((res: any) => {
      this.chapterWithSections.find(x => x.id == id).isBookmarked = res.isBookmarked;
      this.toastService.presentToast('Bookmark removed');
    });
  }

  getLinks() {
    this.lawService.getHyperLinksByLawId(this.lawId).toPromise().then((result: any) => {
      this.hyperLinks = result.body;
      this.setHyperlinksToContent();
    }, error => {
    });
  }

  setHyperlinksToContent() {
    const data = {
      Hyperlinks: this.hyperLinks,
      Articles: this.chapterWithSections
    }
    this.lawService.setHyperlinks(data).subscribe((result) => {
      this.chapterWithSections = result;
    });
  }

  createPdf(article?, categoryCode?) {
    if (article != null) {
      const html = document.getElementById(article.code + 'article');
      var htmlToPdf = htmlToPdfmake(html.innerHTML);
      var dd = { content: htmlToPdf };
      this.pdfObj = pdfMake.createPdf(dd);
      this.exportPdf(article.title);
    } else {
      const html = document.getElementById(categoryCode);
      var htmlToPdf = htmlToPdfmake(html.innerHTML);
      var dd = { content: htmlToPdf };
      this.pdfObj = pdfMake.createPdf(dd);
      this.exportPdf();
    }
  }

  exportPdf(articleTitle?) {
    let path = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else {
      path = this.file.dataDirectory;

    }
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });
      // Save the PDF to the data Directory of our App
      if (articleTitle != null) {
        this.file.writeFile(path, articleTitle + '.pdf', blob, { replace: true, append: false }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(path + articleTitle + '.pdf', 'application/pdf');
        })
      } else {
        this.file.writeFile(path, this.categoryName + '.pdf', blob, { replace: true, append: false }).then(fileEntry => {
          this.fileOpener.open(path + this.categoryName + '.pdf', 'application/pdf');
        })
      }
    });
  }

  findPrev(categoryCode: string) {
    let findCurrentChapter = this.searchResultArticles.find(x => x.chapterCode === categoryCode);
    this.find(-1, findCurrentChapter);
    this.findFirstAndLastMatch();
  }

  findNext(categoryCode: string) {
    let findCurrentChapter = this.searchResultArticles.find(x => x.chapterCode === categoryCode);
    if (this.howManyClicks == 0) {
      this.find(0, findCurrentChapter);
    } else {
      this.find(1, findCurrentChapter);
    }
    this.findFirstAndLastMatch();
    this.howManyClicks = 1;
  }

  findFirstAndLastMatch() {
    if (this.searchText) {
      this.documents = this.document.querySelectorAll('app-laws');
      this.currentDocument = this.documents[this.documents.length - 1]
      this.searchedText = this.currentDocument.querySelectorAll('.selected');
      this.firstMatchFromSearch = this.searchedText[0];
      this.lastMatchFromSearch = this.searchedText[this.searchedText.length - 1];
    }
  }


  find(increment: number, findCurrentChapter: any) {
    this.currentChapter = findCurrentChapter;
    if (this.searchText) {
      this.matchCount = this.searchedText.length;
      this.index += increment;
      if (this.index < 0) {
        this.index = this.searchedText.length - 1;
      }
      if (this.index > this.searchedText.length - 1) {
        this.index = 0;
      }

      if (this.matchCount) {
        let $current = this.searchedText[this.index];
        this.searchedText.forEach(element => {
          element.classList.remove("type-selected");
        });
        if ($current) {
          $current.scrollIntoView(false);
          $current.classList.add('type-selected');


        }
      }
      if (increment === 1) {
        if (this.searchedText[this.index] === this.lastMatchFromSearch) {
          if (this.currentChapter?.nextChapter !== null) {
            this.index = 0;
            this.howManyClicks = 0;
            this.router.navigateByUrl(`/laws/${this.groupCode}/${this.currentChapter?.lawCode}/${this.currentChapter?.nextChapter}`);

          } else {
            this.toastService.presentToast("There is't next chapter that contain this sentence");
          }
        }
      } else if (increment === -1) {
        if (this.searchedText[this.index] === this.firstMatchFromSearch) {
          if (this.currentChapter?.previousChapter !== null) {
            this.index = 0;
            this.howManyClicks = 0;
            this.router.navigateByUrl(`/laws/${this.groupCode}/${this.currentChapter?.lawCode}/${this.currentChapter?.previousChapter}`);
          } else {
            this.toastService.presentToast("There is't previous chapter that contain this sentence");
          }
        }
      }
    }
  }
}