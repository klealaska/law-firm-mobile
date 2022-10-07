import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public email = '';
  public oldPassword = '';
  public newPassword = '';
  public confirmPassword = '';
  isValid = true;

  constructor(public modalController: ModalController,
    public userService: UserService,
    public toastService: ToastService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.getUserEmail();
  }

  getUserEmail() {
    this.userService.getProfile().subscribe((res: any) => {
      this.email = res.email;
    });
  }

  validatePassword(password) {
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{5,}$');
    const valid = regex.test(password);
    if (!valid) {
      this.isValid = false;
      this.toastService.presentToast(
        'Password must have 6 alphanumeric characters, such as: "A,a,@,1"'
      );
    }
  }

  changePassword() {
    this.isValid = true;
    const data = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
    if (this.newPassword.length > 0) {
      this.validatePassword(this.newPassword);
    }
    if (this.confirmPassword.length >= 0 && this.confirmPassword !== this.newPassword) {
      this.isValid = false;
      this.toastService.presentToast('Passwords don\'t match!');
    }
    if (this.isValid) {
      this.userService.postReset(data).subscribe((res: any) => {
        this.loadingService.presentLoading();
        this.toastService.presentToast('Password updated successfully!');
        setTimeout(() => {
          this.loadingService.dismissLoading();
        }, 1000);
        this.dismiss();
      }, error => {
        this.toastService.presentToast('Error! Cannot change, try again later.');
        this.dismiss();
      });
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
