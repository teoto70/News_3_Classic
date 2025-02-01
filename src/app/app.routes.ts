import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { MainComponent } from './components/main/main.component';
import { UploadPostComponent } from './components/upload-post/upload-post.component'; // Adjust the path as needed


export const routes: Routes = [
    
    { path: 'home', component: MainComponent},
    {path: 'creator/login', component: LoginComponent},
    {path: 'admin/createUser', component: CreateUserComponent},
    {path: '**', redirectTo: '/home'},
    { path: '/upload', component: UploadPostComponent},
];