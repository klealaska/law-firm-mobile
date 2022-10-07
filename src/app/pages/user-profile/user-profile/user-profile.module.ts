import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserProfilePageRoutingModule } from './user-profile-routing.module';
import { UserProfilePage } from './user-profile.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    HeaderModule,
    AvatarModule
  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule { }
