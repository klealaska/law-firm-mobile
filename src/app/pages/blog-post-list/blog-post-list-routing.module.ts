import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPostListPage } from './blog-post-list.page';

const routes: Routes = [
  {
    path: '',
    component: BlogPostListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPostListPageRoutingModule {}
