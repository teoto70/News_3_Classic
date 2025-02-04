import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from './environments/environment'; // your Firebase config
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 
    provideAnimations(), provideAnimationsAsync(),
       // Provide the Firebase app
       provideFirebaseApp(() => initializeApp(environment.firebase)),

       // Provide Firestore
       provideFirestore(() => getFirestore())
  ]
})
  .catch((err) => console.error(err)); 
