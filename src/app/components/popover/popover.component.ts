import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LawService } from 'src/app/services/law/law.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  articlesArray;
  groupCode: any;
  lawCode: any;
  code: any;
  fragment: any;
  links = new Array();
  previousSection: string;

  constructor(public navParams: NavParams,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.articlesArray = navParams.data.articlesArray;
    this.groupCode = navParams.data.groupCode;
    this.lawCode = navParams.data.lawCode;
    this.code = navParams.data.code;
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.fragment = { urlFragment: fragment, fragmentCopy: fragment };
    });
  }

  ngOnInit() {
    this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${this.code}`);
    setTimeout(() => {
      this.scrollingAnimation();
    }, 100);
  }

  scrollingAnimation() {
    document.querySelectorAll("ion-item[id]").forEach(link => {
      this.links.push(link);
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`ion-item[id="${id}"]`);
        if (entry.isIntersecting) {
          if (link != null) {
            link.classList.add('visible');
            this.previousSection = entry.target.getAttribute('id');
          }
        }
        else {
          if (link != null) {
            link.classList.remove('visible');
          }
        }
        this.highlightFirstActive();
      });
    }, {
      rootMargin: '0px',
      threshold: 1
    });
    // Track all headings that have an `id` applied
    document.querySelectorAll('h3[id]').forEach((heading) => {
      observer.observe(heading);
    });
  }

  highlightFirstActive() {
    let firstVisibleLink = document.querySelector('.visible');
    this.links.forEach(link => {
      link.classList.remove('active');
    });
    if (firstVisibleLink) {
      firstVisibleLink.classList.add('active');
    }
    if (!firstVisibleLink && this.previousSection) {
      if (document.querySelector(`a[href="#${this.previousSection}"]`) != null) {
        document.querySelector(`a[href="#${this.previousSection}"]`).classList.add('active');
      }
    }
  }

  scrollInArticle(articleCode) {
    var element: any = document.getElementById(articleCode);
    if (element != null) {
      element.scrollIntoView();
      this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + articleCode);
    }
  }

}
