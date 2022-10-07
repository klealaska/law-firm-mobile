import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { InternalObservableService } from 'src/app/services/internal-observable/internal-observable.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profileImgUrl: any;
  firstName: any;
  lastName: any;
  notifications: any;
  notificationList = new Array();
  public language: string = LanguageEnum.Albanian;
  albanian = LanguageEnum.Albanian;
  english = LanguageEnum.English;

  constructor(
    private router: Router,
    public userService: UserService,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private modalController: ModalController,
    private internalObservablesService: InternalObservableService,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) {
    this.notificationService.startConnection();
    this.notificationService.listenToNotifications();
    this.listenNotification();
  }

  ngOnInit() {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
    if (this.userService.isLoggedIn()) {
      this.getCurrentUserData();
      this.updateProfileImage();
    }
  }

  listenNotification() {
    this.internalObservablesService.notificationSubject.subscribe(notification => {
      this.notificationList.push({ notification, time: `${new Date().getHours()}:${new Date().getMinutes()}` });
    });
  }

  goToHome() {
    this.router.navigate(['home'])
  }

  navigate() {
    this.openNavigateAlert();
  }

  goToProfile() {
    this.router.navigate(['user-profile']);
  }

  onLanguageChange(language) {
    this.language = language;
    this.storageService.setStorage(StorageLabelsEnum.appLanguage, language);
    location.reload();
  }

  getCurrentUserData() {
    this.userService.getProfile().subscribe((res: any) => {
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      if (this.storageService.getStorage(StorageLabelsEnum.appLanguage) == null) {
        this.language = res.preferredLanguage;
      }
      if (res.imagePath != null) {
        this.profileImgUrl = res.imagePath.split('\\').join('/').replace("https://localhost:44357", "https://192.168.1.69:45455");
      }
    });
  }

  updateProfileImage() {
    this.userService.getNotifications().subscribe((data: any) => {
      this.profileImgUrl = data.image;
    });
  }

  onLogOut() {
    this.userService.logOut();
    this.toastService.presentToast('Logged out!');
    this.router.navigate(['login']);
  }

  async openNavigateAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'navigate-alert',
      mode: 'ios',
      buttons: [{
        text: 'Go to profile',
        handler: () => this.goToProfile()
      }, {
        text: 'Logout',
        handler: () => this.onLogOut()
      }
      ]

    });
    await alert.present();
    await alert.onDidDismiss();
  }

  async openNotification(notifications) {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      componentProps: { notifications: notifications }
    });
    return await modal.present();
  }
}
