import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LawsPage } from './laws.page';

const routes: Routes = [
  {
    path: '',
    component: LawsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawsPageRoutingModule {}
