import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlogPostViewPage } from './blog-post-view.page';

describe('BlogPostViewPage', () => {
  let component: BlogPostViewPage;
  let fixture: ComponentFixture<BlogPostViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogPostViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
