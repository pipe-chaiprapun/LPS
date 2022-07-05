import { Component, OnInit } from '@angular/core';
declare const App;

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    App.initLoadPage();
  }

}
