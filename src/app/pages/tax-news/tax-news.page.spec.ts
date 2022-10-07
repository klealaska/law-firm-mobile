import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaxNewsPage } from './tax-news.page';

describe('TaxNewsPage', () => {
  let component: TaxNewsPage;
  let fixture: ComponentFixture<TaxNewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxNewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
