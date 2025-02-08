// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

// Always-visible components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdsAsideComponent } from './core/ads-aside/ads-aside.component';
import { LedDisplayComponent } from './led-display/led-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    AdsAsideComponent,
    LedDisplayComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'news';
  isLoggedIn: boolean = false; // Track whether the user is logged in

  constructor(private router: Router) {
    // Example login check (replace with your actual auth logic)
    this.isLoggedIn = !!localStorage.getItem('token');

    // (Optional) Log navigation events for debugging.
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Navigated to:', event.url);
      });
  }

  /**
   * Called when the HeaderComponent emits a categorySelected event.
   * You can use this to filter posts in your main view.
   */
  onCategorySelect(category: string): void {
    // Your implementation here.
    console.log('Category selected:', category);
  }
}
