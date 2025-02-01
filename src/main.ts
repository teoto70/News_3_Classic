import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MainComponent } from './app/components/main/main.component';
import { FooterComponent } from './app/components/footer/footer.component';
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 
    provideAnimations()
  ]
})
  .catch((err) => console.error(err)); 
