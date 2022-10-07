import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  public notificationList: any;

  constructor(
    private modalController: ModalController,
    public navParams: NavParams
  ) {
    this.notificationList = this.navParams.data.notifications;
  }

  ngOnInit() { }

  route(link) {
    location.href = link
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
