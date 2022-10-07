import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VersionsComponent } from './versions.component';

describe('VersionsComponent', () => {
  let component: VersionsComponent;
  let fixture: ComponentFixture<VersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
