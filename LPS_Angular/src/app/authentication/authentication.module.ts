import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthenticationRouting } from './authentication.routing';
import { SharedsModule } from '../shareds/shareds.module';
// import { ReportComponent } from './components/report/report.component';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { UserSearchComponent } from './components/user-setting/user-search/user-search.component';
import { UserInfoComponent } from './components/user-setting/user-info/user-info.component';
import { KpiComponentComponent } from './components/dashboard/kpi-component/kpi-component.component';
// import { ToDoComponent } from './components/dashboard/to-do/to-do.component';
// import { ChartModule } from 'angular2-chartjs';
import { SummaryPortComponent } from './components/dashboard/summary-port/summary-port.component';
// import { OdReportComponent } from './components/report/od-report/od-report.component';

@NgModule({
  declarations: [
    DashboardComponent,
    // CustomerInfoComponent,
    // ReportComponent,
    // AccountServiceComponent,
    // PersonalInfoComponent,
    // PortfolioComponent,
    // UserSettingComponent,
    // UserSearchComponent,
    // UserInfoComponent,
    KpiComponentComponent,
    // ToDoComponent,
    SummaryPortComponent
    // OdReportComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRouting,
    HttpClientModule,
    SharedsModule,
    RouterModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    FormsModule
    // ChartModule
  ]
})
export class AuthenticationModule { constructor() { console.log('Loaded Authen Module'); } }
