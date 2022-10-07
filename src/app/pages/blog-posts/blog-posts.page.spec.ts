import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlogPostsPage } from './blog-posts.page';

describe('BlogPostsPage', () => {
  let component: BlogPostsPage;
  let fixture: ComponentFixture<BlogPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogPostsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
