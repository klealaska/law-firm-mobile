import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxNewsPage } from './tax-news.page';

const routes: Routes = [
  {
    path: '',
    component: TaxNewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxNewsPageRoutingModule {}
