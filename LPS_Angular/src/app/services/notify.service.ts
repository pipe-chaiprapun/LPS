import { Injectable } from '@angular/core';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  notify(title: string, message: string, icon: string, type: string, delay: number) {
    $.notify({
      title: `${title} : `,
      message,
      icon
    }, {
      type,
      delay
    });
  }
}

export const Icon = {
  Danger: 'fa fa-exclamation-triangle',
  Success: 'fa fa-check'
};

export const Type = {
  Sucess: 'success',
  Primary: 'primary',
  Secondary: 'secondary',
  Info: 'info',
  Warning: 'warning',
  Danger: 'danger'
};
