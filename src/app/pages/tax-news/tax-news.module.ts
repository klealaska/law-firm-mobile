import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaxNewsPageRoutingModule } from './tax-news-routing.module';
import { TaxNewsPage } from './tax-news.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxNewsPageRoutingModule,
    HeaderModule
  ],
  declarations: [TaxNewsPage]
})
export class TaxNewsPageModule { }
