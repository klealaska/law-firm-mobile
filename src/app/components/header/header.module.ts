import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    AvatarModule
  ],
  exports: [HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderModule { }
