import { Routes, RouterModule } from '@angular/router';
import { CustomerUrl } from './customer.url';
import { CustomerComponent } from './components/customer/customer.component';
import { RmRoleGuard } from 'src/app/guards/rm-role.guard';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerInfoComponent } from './components/customer/customer-info/customer-info.component';

const RouteList: Routes = [
    // { path: '', redirectTo: CustomerUrl.Customers, pathMatch: 'full' },
    {
        path: '',
        component: CustomerComponent,
        canActivate: [RmRoleGuard],
        runGuardsAndResolvers: 'always',
        children: [
            { path: '', redirectTo: CustomerUrl.List, pathMatch: 'full' },
            {
                path: CustomerUrl.List,
                component: CustomerListComponent,
                canActivate: [RmRoleGuard],
                runGuardsAndResolvers: 'always'
            },
            {
                path: CustomerUrl.Info,
                component: CustomerInfoComponent,
                canActivate: [RmRoleGuard],
                runGuardsAndResolvers: 'always'
            }
        ]
    }
];

export const CustomerRouting = RouterModule.forChild(RouteList);