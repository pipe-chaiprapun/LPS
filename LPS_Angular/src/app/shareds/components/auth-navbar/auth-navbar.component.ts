import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { AppUrl } from 'src/app/app.url';
import { AuthUrl } from 'src/app/authentication/authentication.url';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserModel } from 'src/app/models/UserModel';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { UserRoleModel, RoleType } from 'src/app/models/User/UserRoleModel';
import { UserAccountService } from 'src/app/services/user-account.service';
import { ErrorService } from 'src/app/services/error.service';
import { ReportService } from 'src/app/services/report.service';
declare const $;

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})

export class AuthNavbarComponent implements OnInit {
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;
  userProfile: UserModel;
  currentSession: CurrentSessionModel;
  roles: UserRoleModel[];
  userInfo: string;
  fullScreen: boolean;
  navigationSubscription;
  constructor(private authService: AuthorizationService, private router: Router,
    private userService: UserAccountService, private errorService: ErrorService, private reportService: ReportService) { }

  ngOnInit() {
    this.currentSession = this.authService.getUserProfile;
    this.roles = this.currentSession.user.roles.filter(r => r.ROLE_CODE !== this.currentSession.currentRole.ROLE_CODE);

    if (this.currentSession != null) {
      if (this.currentSession.currentRole) {
        this.userInfo = `(${this.currentSession.user.username.toUpperCase()}) ${this.currentSession.user.name}, 
        Role ${this.currentSession.currentRole.ROLE_DESC}`;
      }
      $('.user-info').fadeIn(1000);
    }

    this.reportService.getReportLst(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
      this.reportService.setReportList(data);
    });

    $('.btn-screen').on('click', () => {
      if (document.fullscreenElement || document['webkitFullscreenElement'] ||
        document['mozFullScreenElement'] || document['msFullscreenElement']) { //in fullscreen, so exit it
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document['msExitFullscreen']) {
          document['msExitFullscreen']();
        } else if (document['mozCancelFullScreen']) {
          document['mozCancelFullScreen']();
        } else if (document['webkitExitFullscreen']) {
          document['webkitExitFullscreen']();
        }
        this.fullScreen = false;
      } else {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement['webkitRequestFullscreen']) {
          document.documentElement['webkitRequestFullscreen']();
        } else if (document.documentElement['mozRequestFullScreen']) {
          document.documentElement['mozRequestFullScreen']();
        } else if (document.documentElement['msRequestFullscreen']) {
          document.documentElement['msRequestFullscreen']();
        }
        this.fullScreen = true;
      }
    });

    // document.addEventListener('fullscreenchange', (event) => {
    //   if (document.fullscreenElement || document['webkitFullscreenElement'] ||
    //     document['mozFullScreenElement'] || document['msFullscreenElement']) {
    //     this.fullScreen = true;
    //   } else {
    //     this.fullScreen = false;
    //   }
    // });
  }

  logout() {
    Swal.fire({
      titleText: 'Do you want to sign out?',
      text: 'Application will redirect to Sign in page',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No',
      focusConfirm: true
    }).then((result) => {
      if (result.value) {
        this.authService.Logout();
        this.router.navigate([`/${this.AppUrl.Login}`]);
      }
    });
  }

  test() {

    let timerInterval;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Automatically log out',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Keep me logged in',
      cancelButtonText: 'Log me out now',
      reverseButtons: true,
      html: 'We will log you out in <b></b> seconds.',
      allowOutsideClick: false,
      timer: 10000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('b')
            .textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
        }, 1000);
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
        this.logout();
      }
    });
  }
  switchRole() {
    $('#selectRoleModal').modal('show');
  }
  selectRole(role) {
    $('#selectRoleModal').modal('hide');
    // console.log(role);

    this.currentSession.currentRole = role;
    const oldDepartment = this.authService.getCurrentUserDepartment;
    const oldType = this.authService.getUserRoleType(oldDepartment.ROLE_CODE);

    this.roles = this.currentSession.user.roles.filter(r => r.ROLE_CODE !== this.currentSession.currentRole.ROLE_CODE);
    this.authService.setUserProfile(this.currentSession);
    this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(roleOrg => {
      this.authService.setUserRoleOrg(roleOrg);
      const type = this.authService.getUserRoleType(this.authService.getUserDepartment(roleOrg).ROLE_CODE);

      if (oldType === type) {
        this.reportService.getReportLst(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
          this.reportService.setReportList(data);
          // this.router.navigate([this.router.url]);
          // this.router.navigateByUrl(this.router.url);
          const url = this.router.parseUrl(this.router.url);
          url.queryParams = {};
          this.router.navigateByUrl(url.toString());
          // window.location.assign(url.toString());
        });
      } else {
        if (type === RoleType.Rm) {
          this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Dashboard}`]);
        } else if (type === RoleType.Security) {
          this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Setting}/usersetting`]);
        } else {
          this.errorService.onRequestError('SIGN IN', { status: 401, error: 'Your role is unauthorized!' });
        }
      }
    });

    if (this.currentSession.currentRole) {
      this.userInfo = `(${this.currentSession.user.username.toUpperCase()})
          ${this.currentSession.user.name}, Role ${this.currentSession.currentRole.ROLE_DESC}`;
    } else {
      this.userInfo = `(${this.currentSession.user.username.toUpperCase()}) ${this.currentSession.user.name}`;
    }
    // this.router.navigate([this.router.url]);
  }
}
