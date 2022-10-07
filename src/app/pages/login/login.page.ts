import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { Device } from '@ionic-native/device/ngx';
import { RegisterService } from 'src/app/services/register/register.service';
import { AlertController } from '@ionic/angular';
interface SelectedInput {
  id?: number;
  name?: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  segmentModel;
  emailForLogin = '';
  passwordForLogin = '';
  userRoles = new Array();

  //register
  industrySelected: boolean = false;
  proffesionSelected: boolean = false;
  influentialSelected: boolean = false;
  public userGroups = new Array();
  public userCategories = new Array();
  source;
  userCategory: SelectedInput;
  condition2;
  condition1;
  confirmPassword;
  password;
  email;
  userGroup: SelectedInput;
  company;
  lastName;
  firstName;
  public userRoleIds = [11];
  isValid = true;
  current_category: SelectedInput;
  current_group: SelectedInput;
  sources = [
    { id: 1, name: 'LinkedIn' },
    { id: 2, name: 'Word of mouth' },
    { id: 3, name: 'Events' },
    { id: 4, name: 'Publications' },
    { id: 5, name: 'Others' },
  ];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private route: Router,
    public toastService: ToastService,
    private loadingService: LoadingService,
    private device: Device,
    private registerService: RegisterService,
    private laodingService: LoadingService,
    private alertController: AlertController

  ) { }

  ngOnInit() {
    this.segmentModel = "existing_users";
    this.getUserGroups();
    this.getUserCategories();
  }

  getUserGroups() {
    this.registerService.getUserGroups().subscribe((result: any) => {
      this.userGroups = result.body;
    });
  }

  getUserCategories() {
    this.registerService.getUserCategories().subscribe((result: any) => {
      this.userCategories = result.body;
    });
  }

  onLogin() {
    const data = {
      email: this.emailForLogin,
      password: this.passwordForLogin,
    };
    if (data.password.length > 0 || data.email.length > 0) {
      this.userService.postLogin(data).subscribe(
        (res: any) => {
          this.loadingService.presentLoading();
          res.userResponse.roles.forEach(role => {
            this.userRoles.push(role.name);
            if (this.userService.userSystemRoles.includes(role.name)) {
              if (res.token === '') {
                this.toastService.presentToast('Unauthorized!');
              }
              this.storageService.setAuthToken(res.token);
              this.storageService.setStorage('UserRoles', JSON.stringify(this.userRoles));
              this.toastService.presentToast('Login successful!');
              this.route.navigate(['']);
            } else {
              this.toastService.presentToast('You don\'t have permission to login!');
            }
            this.loadingService.dismissLoading();
          });
        },
        (error) => {
          if (error.status === 403) {
            this.loadingService.presentLoading();
            this.toastService.presentToast(
              'You cannot login! Please verify your account first!'
            );
            this.loadingService.dismissLoading();
          } else if (error.status === 400) {
            this.loadingService.presentLoading();
            this.toastService.presentToast('Invalid Email or Password!');
            this.loadingService.dismissLoading();
          } else {
            this.loadingService.presentLoading();
            this.toastService.presentToast('Something went wrong! Try again later!');
            this.loadingService.dismissLoading();
          }
        }
      );
    } else {
      this.loadingService.presentLoading();
      this.toastService.presentToast('Not valid! Please fill out the fields!');
      this.loadingService.dismissLoading();
    }
  }

  getDeviceDetails() {
    var model = this.device.model;
    var deviceId = this.device.uuid;
    console.log(model + 'Phone model', deviceId + 'Device id');
  }

  selectIndustry() {
    this.industrySelected = true;
  }

  selectProffesion() {
    this.proffesionSelected = true;
  }

  selectInfluential() {
    this.influentialSelected = true;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'style-alert',
      header: 'YOUR ACCOUNT HAS BEEEN SAVED',
      message: 'In order to complete the sign-up process, please confirm your email account.',
      buttons: ['CLOSE']
    });
    await alert.present();
  }

  onSubmit() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      email: this.email,
      password: this.password,
      userGroupId: this.current_group.id,
      userCategoryId: this.current_category.id,
      userRoleIds: this.userRoleIds,
    };
    if (this.password.length > 0) {
      this.validatePassword(this.password);
    }
    if (this.confirmPassword.length >= 0 && this.confirmPassword !== this.password) {
      this.isValid = false;
      this.toastService.presentToast('Passwords don\'t match!');
    }
    if (this.isValid) {
      this.laodingService.presentLoading();
      this.registerService.postRegister(data).subscribe(
        () => {
          this.laodingService.dismissLoading();
          this.presentAlert();
        },
        (error) => {
          if (error.status === 403) {
            this.toastService.presentToast('Email already exists ! Try another email!');
            this.laodingService.dismissLoading();
          } else {
            this.toastService.presentToast('Error! Something went wrong, try again later.');
            this.laodingService.dismissLoading();
          }
        }
      );
    }
  }

  validatePassword(password) {
    const regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.{5,})");
    const valid = regex.test(password);
    if (!valid) {
      this.isValid = false;
      this.toastService.presentToast('Invalid password');
    }
  }

  goToRegister() {
    this.segmentModel = 'new_users';
  }
}
