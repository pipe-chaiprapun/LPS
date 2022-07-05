import { Routes, RouterModule } from '@angular/router';
import { ReportUrl } from './report.url';
import { RmRoleGuard } from 'src/app/guards/rm-role.guard';
import { OdStatementComponent } from './components/od-statement/od-statement.component';

const RouteList: Routes = [
    {
        path: '',
        canActivate: [RmRoleGuard],
        runGuardsAndResolvers: 'always',
        children: [
            { path: '', redirectTo: ReportUrl.OdUtilize, pathMatch: 'full' },
            {
                path: ReportUrl.OdUtilize,
                component: OdStatementComponent,
                canActivate: [RmRoleGuard],
                runGuardsAndResolvers: 'always'
            }
        ]
    }
];

export const ReportRouting = RouterModule.forChild(RouteList);
