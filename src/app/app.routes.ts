import { Routes } from '@angular/router';
import { LoginComponent } from './services/login/login.component';
import { RegisterAdminComponent } from './services/register-admin/register-admin.component';
import { UserManagementComponent } from './services/user-management/user-management.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register-admin', component: RegisterAdminComponent },
    { path: 'user-management', component: UserManagementComponent },
];