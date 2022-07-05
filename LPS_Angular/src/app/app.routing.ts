import { Routes, RouterModule } from '@angular/router';
import { AppUrl } from './app.url';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: AppUrl.Login, pathMatch: 'full' },
    { path: AppUrl.Login, component: LoginComponent },
    // { path: AppUrl.Authen, loadChildren: './authentication/authentication.module#AuthenticationModule' },
    {
        path: AppUrl.Authen, loadChildren: './authentication/authentication.module#AuthenticationModule',
        canActivate: [AuthGuard], runGuardsAndResolvers: 'always',
    }
];

export const AppRouting = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' });
