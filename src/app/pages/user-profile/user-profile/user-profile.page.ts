import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { RegisterService } from 'src/app/services/register/register.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
interface UserCategory {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  public userGroups = new Array();
  public userCategories = new Array();
  public userRoleIds = [11];
  imagePath;
  userId;
  userCategoryName;
  userGroupName;
  userCategoryId;
  userGroupId;
  isValid = true;
  blackList = [null, 'null', undefined, ''];
  firstName: any;
  lastName: any;
  email: any;
  company: any;
  notificationRules: any;
  current_category = this.userCategories[0];
  current_group = this.userGroups[0];
  @ViewChild('fileInput', { static: false }) el: ElementRef;
  file: [null];
  preferedLanguage: any;


  constructor(
    public modalController: ModalController,
    private registerService: RegisterService,
    private userService: UserService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef,
    public loadingController: LoadingController,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.presentLoading();
    this.getUserGroups();
    this.getUserCategories();
    this.getUserData();
    this.loadingService.dismissLoading();
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

  getUserData() {
    this.userService.getProfile().subscribe((res: any) => {
      this.userId = res.id;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.email = res.email;
      this.company = this.blackList.includes(res.company) ? '' : res.company;
      this.userCategoryId = res.userCategoryId;
      this.userGroupId = res.userGroupId;
      this.userCategoryName = res.userCategoryName;
      this.userGroupName = res.userGroupName;
      this.notificationRules = res.notificationRules;
      let category: UserCategory = { name: this.userCategoryName, id: this.userCategoryId };
      let categoryIndex: number = this.userCategories.findIndex(item => item.id === category.id);
      this.current_category = this.userCategories[categoryIndex];
      let group: UserCategory = { name: this.userCategoryName, id: this.userGroupId };
      let index: number = this.userGroups.findIndex(item => item.id === group.id);
      this.current_group = this.userGroups[index];
      this.preferedLanguage = res.preferredLanguage;
      if (res.imagePath != null) {
        this.imagePath = res.imagePath.replace("https://localhost:44357", "https://192.168.1.69:45455").split('\\').join('/');
      }
    }, (error) => {
      error.status == 400
        ? this.toastService.presentToast(error.error)
        : this.toastService.presentToast('Something went wrong');
    });
  }

  uploadFile(event) {
    const reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePath = reader.result;
        file = reader.result;
      };
      this.cd.markForCheck();
      this.presentLoading();
    }
  }

  deletePhoto() {
    this.imagePath = null;
    this.file = [null];
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading...',
      duration: 800
    });
    await loading.present();
  }

  editProfile() {
    this.isValid = true;
    const dataToUpdate = {
      id: this.userId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      userCategoryId: this.current_category.id,
      userGroupId: this.current_group.id,
      userRoleIds: this.userRoleIds
    };
    if (this.isValid) {
      this.userService.updateProfile(dataToUpdate).subscribe(() => {
        this.loadingService.presentLoading();
        this.toastService.presentToast('Updated successfully!');
        this.loadingService.dismissLoading();
      }, error => {
        this.toastService.presentToast('Error! Cannot edit, try again later.');
      });
    }
  }

  uploadImage() {
    const dataToUpdate = {
      id: this.userId,
      imageContent: this.imagePath != null ? this.imagePath.split(',')[1] : null
    };
    this.userService.updateUserProfileImage(dataToUpdate).subscribe(() => {
      this.userService.sendNotification(this.imagePath);
      this.toastService.presentToast('Profile image updated successfully');
    }, () => {
      this.toastService.presentToast('Something went wrong, try again later');
    });
  }

  removeImage() {
    const dataToUpdate = {
      id: this.userId,
      imageContent: null
    };
    this.userService.updateUserProfileImage(dataToUpdate).subscribe(() => {
      this.imagePath = null;
      this.userService.sendNotification(this.imagePath);
      this.toastService.presentToast('Profile image removed successfully');
    }, () => {
      this.toastService.presentToast('Something went wrong, try again later');
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ChangePasswordComponent
    });
    return await modal.present();
  }

  async notificationSliderChanged(type) {
    await this.userService.updateNotificationRules(type).toPromise();
  }

  async setPreferedLanguage(language) {
    if (language == 1) {
      this.preferedLanguage = 'sq-AL';
    } else {
      this.preferedLanguage = 'en-US';
    }
    await this.userService.updatePreferredLanguage(language);
  }

}
