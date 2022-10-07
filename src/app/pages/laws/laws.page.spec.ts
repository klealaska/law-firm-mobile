import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LawsPage } from './laws.page';

describe('LawsPage', () => {
  let component: LawsPage;
  let fixture: ComponentFixture<LawsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LawsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
