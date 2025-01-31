import { Routes } from '@angular/router';
import { PostFlowComponent } from './post-flow/post-flow.component';
import { LoginComponent } from './user/login/login.component';
import { CreateUserComponent } from './user/create-user/create-user.component';

export const routes: Routes = [
    { path: '', component: PostFlowComponent },
    { path: 'home', component: PostFlowComponent },
    {path: 'creator/login', component: LoginComponent},
    {path: 'admin/createUser', component: CreateUserComponent},
    {path: '**', redirectTo: '/home'}
];