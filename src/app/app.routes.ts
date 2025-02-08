// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { UploadPostComponent } from './components/upload-post/upload-post.component';
import { AllPostComponent } from './post/all-post/all-post.component';
import { NewPostComponent } from './post/new-post/new-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostResolver } from './services/post-resolver';

export const routes: Routes = [
  // Remove the default route that loads MainComponent.
  { path: 'login', component: LoginComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'upload', component: UploadPostComponent },
 { path: 'post/:docId', 
  component: PostDetailComponent,
  resolve: { post: PostResolver }},
  {path: 'posts', component: AllPostComponent},	
  { path: 'new', component: NewPostComponent },
  { path: '**', redirectTo: '' }, // Optionally, handle unknown routes.
];
