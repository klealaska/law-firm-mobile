import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LawsPageRoutingModule } from './laws-routing.module';

import { LawsPage } from './laws.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { MarkjsHighlightDirective } from 'src/app/directives/markjs.highlight.directive';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LawsPageRoutingModule,
    HeaderModule,
  ],
  declarations: [LawsPage, MarkjsHighlightDirective],
  entryComponents: [MarkjsHighlightDirective]

})
export class LawsPageModule { }
