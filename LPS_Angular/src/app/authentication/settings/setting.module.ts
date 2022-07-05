import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRouting } from './setting.routing';
import { HttpClientModule } from '@angular/common/http';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { RouterModule } from '@angular/router';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { UserSearchComponent } from './components/user-setting/user-search/user-search.component';
import { UserInfoComponent } from './components/user-setting/user-info/user-info.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserSettingComponent, UserSearchComponent, UserInfoComponent],
  imports: [
    CommonModule,
    SettingRouting,
    HttpClientModule,
    SharedsModule,
    RouterModule,
    PaginationModule.forRoot(),
    FormsModule
  ]
})
export class SettingModule { constructor() { console.log('Loaded Setting Module'); } }
