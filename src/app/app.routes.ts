// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './user/login/login.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { UploadPostComponent } from './components/upload-post/upload-post.component';
import { AllPostComponent } from './post/all-post/all-post.component';
import { NewPostComponent } from './post/new-post/new-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostResolver } from './services/post-resolver';

export const routes: Routes = [
  // Default route: when the app starts, load MainComponent.
   // Redirect an empty path to the main component with 'All' as the default category.
   { path: '', redirectTo: 'main/All', pathMatch: 'full' },
   { path: 'main/:selectedCategory', component: MainComponent },
   // Optionally, add a wildcard route:
  
  // Other routes for login, user creation, uploading, etc.
  { path: 'login', component: LoginComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'upload', component: UploadPostComponent },
  { path: 'posts', component: AllPostComponent },
  { path: 'new', component: NewPostComponent },

  // Dedicated route for post detail; this replaces the main view.
  { 
    path: 'post/:docId', 
    component: PostDetailComponent,
    resolve: { post: PostResolver }  // This preloads the post data (optional but recommended)
  },
  
  // Wildcard route: redirect any unknown URL to the default.
  { path: '**', redirectTo: '' }
];
