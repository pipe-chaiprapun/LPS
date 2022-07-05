import { Routes, RouterModule } from '@angular/router';
import { AuthUrl } from './authentication.url';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { RmRoleGuard } from '../guards/rm-role.guard';
import { SecurityRoleGuard } from '../guards/security-role.guard';
// import { OdReportComponent } from './components/report/od-report/od-report.component';

const RouteList: Routes = [
  { path: '', redirectTo: AuthUrl.Dashboard, pathMatch: 'full' },
  { path: AuthUrl.Dashboard, component: DashboardComponent, canActivate: [RmRoleGuard], runGuardsAndResolvers: 'always' },
  // { path: AuthUrl.Customer, component: CustomerInfoComponent, canActivate: [RmRoleGuard], runGuardsAndResolvers: 'always' },
  {
    path: AuthUrl.Customer, loadChildren: './customer/customer.module#CustomerModule',
    canActivate: [RmRoleGuard], runGuardsAndResolvers: 'always'
  },
  // { path: AuthUrl.OdUtilize, component: OdReportComponent, canActivate: [RmRoleGuard], runGuardsAndResolvers: 'always' },
  {
    path: AuthUrl.Report, loadChildren: './report/report.module#ReportModule',
    canActivate: [RmRoleGuard], runGuardsAndResolvers: 'always'
  },
  // { path: AuthUrl.UserSetting, component: UserSettingComponent, canActivate: [SecurityRoleGuard], runGuardsAndResolvers: 'always' }
  {
    path: AuthUrl.Setting, loadChildren: './settings/setting.module#SettingModule',
    canActivate: [SecurityRoleGuard], runGuardsAndResolvers: 'always'
  }
];

export const AuthenticationRouting = RouterModule.forChild(RouteList);
