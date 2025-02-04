import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; 
import { provideStorage, getStorage } from '@angular/fire/storage';
import { QuillModule } from 'ngx-quill'; // ✅ Import Quill
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(QuillModule), // ✅ Correct way to provide QuillModule
    importProvidersFrom(QuillModule) // ✅ Correct way to provide QuillModule
  ]
};
