import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogPostListPageRoutingModule } from './blog-post-list-routing.module';

import { BlogPostListPage } from './blog-post-list.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogPostListPageRoutingModule,
    HeaderModule
  ],
  declarations: [BlogPostListPage]
})
export class BlogPostListPageModule { }
