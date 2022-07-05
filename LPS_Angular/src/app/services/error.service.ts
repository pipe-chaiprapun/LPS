import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppUrl } from '../app.url';
// import { NotifyService, Icon, Type } from './notify.service';
import Swal from 'sweetalert2';
import { AuthUrl } from '../authentication/authentication.url';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  AuthUrl = AuthUrl;
  constructor(private router: Router) { }

  onRequestError(title, error) {
    console.log(error);
    if (error.error) {
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        if (error.status === 401) {
          if (error.error.Message) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.error.Message}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            }).then((result) => {
              this.router.navigate([`/${AppUrl.Login}`]);
            });
          } else if (error.statusText) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.statusText}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            }).then((result) => {
              this.router.navigate([`/${AppUrl.Login}`]);
            });
          } else if (error.message) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.message}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            }).then((result) => {
              this.router.navigate([`/${AppUrl.Login}`]);
            });
          } else {
            Swal.fire({
              title: 'Failure!',
              text: `${error.error}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            }).then((result) => {
              this.router.navigate([`/${AppUrl.Login}`]);
            });
          }
          // $('.modal').remove();
          // $('.modal-backdrop').remove();
          // $('body').removeClass('modal-open');
          this.router.navigate([`/${AppUrl.Login}`]);
        } else if (error.status === 403) {
          Swal.fire({
            title: 'Failure!',
            text: `${error.error}`,
            icon: 'error',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 5000
          }).then((result) => {
            this.router.navigate([`/${AppUrl.Authen}/${this.AuthUrl.Dashboard}`]);
          });
        } else {
          if (error.error.ExceptionMessage != null) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.error.ExceptionMessage}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            });
            // this.notifyService.notify(title, error.error.ExceptionMessage, Icon.Danger, Type.Danger, 1000);
          } else if (error.error.Message != null) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.error.Message}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            });
            // this.notifyService.notify(title, error.error.Message, Icon.Danger, Type.Danger, 1000);
          } else if (error.message != null) {
            Swal.fire({
              title: 'Failure!',
              text: `${error.message}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            });
          } else {
            Swal.fire({
              title: 'Failure!',
              text: `${error.error}`,
              icon: 'error',
              showConfirmButton: false,
              showCloseButton: true,
              timer: 5000
            });
            // this.notifyService.notify(title, error.message, Icon.Danger, Type.Danger, 1000);
          }
        }
      }
    } else {
      Swal.fire({
        title: 'Failure!',
        text: `${error.statusText}`,
        icon: 'error',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 5000
      });
    }
  }
}
