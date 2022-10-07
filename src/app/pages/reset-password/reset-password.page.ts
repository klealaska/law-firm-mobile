import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email = '';
  oldPassword = '';
  newPassword = '';
  isValid = true;

  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
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

  resetPassword() {
    const data = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
    if (this.newPassword.length > 0) {
      this.loadingService.presentLoading();
      this.validatePassword(this.newPassword);
      this.loadingService.dismissLoading();
    }
    if (this.isValid) {
      this.userService.postReset(data).subscribe(() => {
        this.loadingService.presentLoading();
        this.toastService.presentToast('Password updated successfully!');
        this.router.navigate(['login']);
        this.loadingService.dismissLoading();
      }, error => {
        this.loadingService.presentLoading();
        this.toastService.presentToast('Error! Cannot reset, please try again.');
        this.loadingService.dismissLoading();
      });
    } else {
      this.toastService.presentToast('Error! Cannot reset, please try again.');
    }
  }

}
