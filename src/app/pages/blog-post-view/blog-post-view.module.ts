import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogPostViewPageRoutingModule } from './blog-post-view-routing.module';

import { BlogPostViewPage } from './blog-post-view.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { PipeModule } from 'src/app/helpers/pipes/pipe.module';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogPostViewPageRoutingModule,
    HeaderModule,
    PipeModule,
    AvatarModule
  ],
  declarations: [BlogPostViewPage]
})
export class BlogPostViewPageModule { }
