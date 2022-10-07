import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var require: any;
const Mark = require('mark.js');

let cancelAnimationId;

function animate({ timing, draw, duration }) {
  const start = performance.now();
  cancelAnimationId = requestAnimationFrame(function animate2(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) {
      timeFraction = 1;
    }
    const progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      cancelAnimationId = requestAnimationFrame(animate2);
    }
  });
}


@Directive({
  selector: '[textToHighlight]'
})
export class MarkjsHighlightDirective implements OnChanges {

  @Input() textToHighlight = '';
  @Input() markjsConfig: any = {};
  @Input() scrollToFirstMarked: boolean = true;

  @Output() getInstance = new EventEmitter<any>();

  markInstance: any;

  constructor(
    private contentElementRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes) {
    if (!this.markInstance) {
      this.markInstance = new Mark(this.contentElementRef.nativeElement);
      this.getInstance.emit(this.markInstance);
    }

    this.hightlightText();
    if (this.scrollToFirstMarked) {
      this.scrollToFirstMarkedText();
    }
  }

  buildTextToHighlight(replaceChar) {
    if (this.textToHighlight.length > 0) {
      var keywords = this.textToHighlight.split(' ');
      let keyword = "";
      let array = [];
      if (keywords.length > 1) {
        keywords.forEach(element => {
          if (environment.excludeWords.includes(element)) {
            array.push(element);
            element = replaceChar;
          }
          keyword = keyword + " " + element;
        });
      } else {
        keyword = this.textToHighlight;
      }

      keyword = keyword.trim();
      return keyword;
    }
  }
  hightlightText() {
    this.textToHighlight = this.textToHighlight || '';
    if (this.textToHighlight && this.textToHighlight.length < 3) {
      this.markInstance.unmark();
      return;
    } else {
      this.markInstance.unmark({

        done: () => {
          var options = {
            "element": "mark",
            "className": "selected",
            "diacritics": true,
            "exclude": [],
            "separateWordSearch": true,
            "accuracy": "complementary",
            "acrossElements": true,
            //"synonyms": {}
          };
          //options.synonyms = environment.synonyms;
          this.markjsConfig = options;
          if (this.textToHighlight.length > 0) {
            let re = this.buildTextToHighlight("%");
            this.markInstance.mark((re || ''), this.markjsConfig);
          }
        }
      });
    }
  }

  createDiacriticsRegExp(str) {
    var sens = true ? '' : 'i',
      dct = true ? ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'] : ['aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćčCÇĆČ', 'dđďDĐĎ', 'eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïīIÌÍỈĨỊÎÏĪ', 'lłLŁ', 'nñňńNÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rřRŘ', 'sšśșşSŠŚȘŞ', 'tťțţTŤȚŢ', 'uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿYÝỲỶỸỴŸ', 'zžżźZŽŻŹ'];
    var handled = [];
    str.split('').forEach(function (ch) {
      dct.every(function (dct) {
        if (dct.indexOf(ch) !== -1) {
          if (handled.indexOf(dct) > -1) {
            return false;
          }
          str = str.replace(new RegExp('[' + dct + ']', 'gm' + sens), '[' + dct + ']');
          handled.push(dct);
        }
        return true;
      });
    });
    return str;
  }

  scrollToFirstMarkedText() {
    const content = this.contentElementRef.nativeElement;
    const firstOffsetTop = (content.querySelector('mark') || {}).offsetTop || 0;

    this.scrollSmooth(content, firstOffsetTop);
  }

  scrollSmooth(scrollElement, firstOffsetTop) {
    const renderer = this.renderer;

    if (cancelAnimationId) {
      cancelAnimationFrame(cancelAnimationId);
    }
    const currentScrollTop = scrollElement.scrollTop;
    const delta = firstOffsetTop - currentScrollTop;

    animate({
      duration: 500,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        const nextStep = currentScrollTop + progress * delta;
        renderer.setProperty(scrollElement, 'scrollTop', nextStep);
      }
    });
  }
}