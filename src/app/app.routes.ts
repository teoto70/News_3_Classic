import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'home', component: MainComponent },
    {path: 'creator/login', component: LoginComponent},
    {path: 'admin/createUser', component: CreateUserComponent},
    {path: '**', redirectTo: '/home'}
];