import { Component, OnInit } from '@angular/core';
import { LawService } from 'src/app/services/law/law.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { MenuController } from '@ionic/angular';
import { SearchService } from 'src/app/services/search/search.service';
import { ToastService } from 'src/app/services/toast/toast.service';
interface TreeNodeMazars {
  code: string;
  id: number;
  name: string;
  parentId: number;
  depth: number;
  branchDepth: number;
  isChapter: boolean;
  children?: TreeNodeMazars[];
  isClicked: boolean;
  countSearchWords: 0;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  tree = new Array();
  treeControl = new NestedTreeControl<TreeNodeMazars>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNodeMazars>();
  activeNodeCode: string;
  showFirstView: boolean = true;
  treeExpanded: boolean = false;
  isLoggedIn: any;
  groupCode: string;
  lawCode: string;
  groupCodeForSearch: any;
  node: any;
  articleCode: string;
  pages;
  searchText;
  groupCodeTreeExpanded: any;
  countWordsForChapter: any;

  constructor(
    private lawService: LawService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private menuCtrl: MenuController,
    private searchService: SearchService,
    private toastService: ToastService
  ) { this.isLoggedIn = this.userService.isLoggedIn(); }

  async ngOnInit() {
    this.sideMenu();
    await this.getLawCategories();
  }

  sideMenu() {
    this.pages =
      [
        {
          title: "Kendi i diskutimeve",
          url: "/blog-posts"
        },
        {
          title: "Lajme dhe njoftime",
          url: "/tax-news"
        },
        {
          title: "Bookmarks",
          url: "/bookmarks"
        },
        {
          title: "Pyetje",
          url: "/questions"
        },
      ]
  }

  async getLawCategories() {
    let result: any = await this.lawService.getSidebarTree();
    result.forEach(node => {
      node.isClicked = false;
      if (node.children.length > 0) {
        this.tree.push(node);
      }
    });
    this.dataSource.data = this.tree;
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.activeNodeCode = fragment;
    });
    this.treeControl.dataNodes = this.dataSource.data;
    const tree = this.treeControl.dataNodes;
    this.expandTree(tree, this.activeNodeCode);
  }

  expandTree(data: TreeNodeMazars[], code: string) {
    data.forEach(node => {
      if (node.children && node.children.find(c => c.code === code)) {
        this.showFirstView = false;
        this.treeControl.expand(node);
        node.isClicked = true;
        this.treeExpanded = true;
        this.expandTree(this.treeControl.dataNodes, node.code)
      } else if (node.children && node.children.find(c => c.children)) {
        this.expandTree(node.children, code);
      }
    });
  }

  hasChild = (_: number, node: TreeNodeMazars) => !!node.children && node.children.length > 0;

  showSidebarFirstView() {
    this.showFirstView = true;
    this.treeExpanded = false;
    this.dataSource.data.forEach(node => {
      node.isClicked = false;
    });
    this.treeControl.collapseAll();
  }

  openChapterWithSections(code, isChapter, node) {
    if (!node.isChapter) {
      this.clickNode(node);
    }
    this.dataSource.data.forEach(node => {
      node.children.forEach(childrenL1 => {
        childrenL1.children.forEach(childrenL2 => {
          if (childrenL2.code === code) {
            this.groupCode = node.code;
            this.lawCode = childrenL1.code;
          }
        });
      });
    });
    if (isChapter === true) {
      this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${code}`);
      this.closeMenu();
    }
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  clickNode(node) {
    if (node.parentId === 0) {
      this.groupCodeForSearch = node.code;
    }
    this.node = node;
    if (node.depth == 1) {
      this.treeExpanded = false;
      node.isClicked = !node.isClicked;
      if (node.isClicked) {
        this.treeExpanded = true;
      }
    }
    this.showFirstView = false;

  }

  scroll(el) {
    this.dataSource.data.forEach(node => {
      node.children.forEach(childrenL1 => {
        childrenL1.children.forEach(childrenL2 => {
          childrenL2.children.forEach(childrenL3 => {
            if (childrenL3.code === el) {
              this.articleCode = childrenL2.code;
              this.lawCode = childrenL1.code;
              this.groupCode = node.code;
            }
          });
        });
      });
    });
    this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${this.articleCode}` + "#" + el);
    var element = document.getElementById(el);
    if (element != null) {
      element.scrollIntoView();
    }
    this.closeMenu();
  }

  doSearch() {
    this.groupCodeTreeExpanded = this.lawService.groupCode;
    if (this.searchText.length > 2) {
      this.searchText = this.searchText.trim();
      const data = {
        groupCode: this.groupCodeForSearch != null ? this.groupCodeForSearch : this.groupCodeTreeExpanded,
        keyword: this.searchText,
        language: "sq-AL" // TODO get current language dynamically
      }
      this.searchService.postSearch(data).subscribe((result: any) => {
        this.dataSource.data.forEach(node => {
          node.children.forEach(childrenL1 => {
            childrenL1.children.forEach(childrenL2 => {
              this.countWordsForChapter = 0;
              childrenL2.children.forEach(childrenL3 => {
                result.forEach(element => {
                  if (childrenL3.id === element.lawArticleId) {
                    childrenL3.countSearchWords = element.countSentence;
                    this.countWordsForChapter += element.countSentence;
                  }
                });
              });
              childrenL2.countSearchWords = this.countWordsForChapter;
            });
          });
        });
        this.dataSource.data = this.tree;
        this.treeControl.dataNodes = this.dataSource.data;
        this.searchService.getSuggestion(result);
      });
    } else {
      this.toastService.presentToast('Enter 3 or more characters to search')
    }
    this.treeControl.expandAll();
  }

  getSearchText(event) {
    this.searchText = event.target.value;
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.doSearch();
      this.menuCtrl.close();
    }
  }
}
