import { Routes, RouterModule } from '@angular/router';
import { SettingUrl } from './setting.url';
import { SecurityRoleGuard } from 'src/app/guards/security-role.guard';
import { UserSettingComponent } from './components/user-setting/user-setting.component';

const RouteList: Routes = [
    {
        path: '',
        canActivate: [SecurityRoleGuard],
        runGuardsAndResolvers: 'always',
        children: [
            { path: '', redirectTo: SettingUrl.UserSetting, pathMatch: 'full' },
            {
                path: SettingUrl.UserSetting,
                component: UserSettingComponent,
                canActivate: [SecurityRoleGuard],
                runGuardsAndResolvers: 'always'
            }
        ]
    }
];

export const SettingRouting = RouterModule.forChild(RouteList);
