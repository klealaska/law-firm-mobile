import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogPostsPageRoutingModule } from './blog-posts-routing.module';

import { BlogPostsPage } from './blog-posts.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogPostsPageRoutingModule,
    HeaderModule
  ],
  declarations: [BlogPostsPage]
})
export class BlogPostsPageModule { }
