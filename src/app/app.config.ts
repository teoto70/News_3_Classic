import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyBjvaRA_tfM27wB1CKR12spKxvZsgvYb8U',
        authDomain: 'news-52788.firebaseapp.com',
        projectId: 'news-52788',
        storageBucket: 'news-52788.firebasestorage.app',
        messagingSenderId: '555756851760',
        appId: '1:555756851760:web:4240227f6ec24a6e6013f5',
        measurementId: 'G-JBS2PZ2JL2',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
