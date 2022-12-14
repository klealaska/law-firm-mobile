import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPostViewPage } from './blog-post-view.page';

const routes: Routes = [
  {
    path: '',
    component: BlogPostViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPostViewPageRoutingModule {}
