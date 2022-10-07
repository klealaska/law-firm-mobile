import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlogPostListPage } from './blog-post-list.page';

describe('BlogPostListPage', () => {
  let component: BlogPostListPage;
  let fixture: ComponentFixture<BlogPostListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogPostListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
