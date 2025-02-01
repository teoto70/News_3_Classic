import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LedDisplayComponent } from './led-display/led-display.component';
import { AdsAsideComponent } from './core/ads-aside/ads-aside.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LedDisplayComponent,
    AdsAsideComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'news';
  // Default selected category; this is passed to the main component.
  selectedCategory: string = 'All';

  constructor(private router: Router) {
    // (Optional) Subscribe to router events if you want to hide components on certain routes.
    this.router.events.subscribe(() => {
      // Your route-based logic can go here.
    });
  }

  /**
   * Called when the HeaderComponent emits a categorySelected event.
   * Note: The HTML calls this method "onCategorySelect", so make sure the name matches.
   *
   * @param category The category selected by the user.
   */
  onCategorySelect(category: string): void {
    this.selectedCategory = category;
  }
}
