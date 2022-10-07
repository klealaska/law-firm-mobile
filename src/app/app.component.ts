import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, MenuController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  links: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController

  ) {
    this.sideMenu();
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
    });
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('c5318365-53b3-4429-99e4-d271f458facf', '706726800058');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;

      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
  }

  sideMenu() {
    this.links =
      [
        {
          title: "Mazars ne shqiperi",
          url: "https://www.mazars.al/"
        },
        {
          title: "Sherbimet tona",
          url: "https://www.mazars.al/Home/Our-expertise"
        },
        {
          title: "Kontakt",
          url: "/contact"
        }
      ]
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
