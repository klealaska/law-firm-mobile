import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PopoverComponent } from './components/popover/popover.component';
import { RelatedLinksComponent } from './components/related-links/related-links.component';
import { TagsComponent } from './components/tags/tags.component';
import { TreeComponent } from './components/tree/tree.component';
import { InterceptorService } from './helpers/interceptor/interceptor.service';
import { SharedModule } from './shared/shared.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { VersionsComponent } from './components/versions/versions.component';


@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    TreeComponent,
    PopoverComponent,
    TagsComponent,
    NotificationComponent,
    RelatedLinksComponent,
    VersionsComponent
  ],
  entryComponents: [],
  imports: [BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    NoopAnimationsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    File,
    FileOpener,
    Device,
    OneSignal


  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
