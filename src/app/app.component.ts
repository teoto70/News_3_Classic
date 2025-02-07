import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LedDisplayComponent } from './led-display/led-display.component';
import { AdsAsideComponent } from './core/ads-aside/ads-aside.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NewPostComponent } from './post/new-post/new-post.component';
import { AllPostComponent } from './post/all-post/all-post.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Needed for directives like *ngIf
    RouterOutlet,
    LedDisplayComponent,
    AdsAsideComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
   
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'news';
  selectedCategory: string = 'All';
  isHiddenPage = false;

  constructor(private router: Router) {
    // Use NavigationEnd events to ensure the URL is updated
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if the URL is one of the routes where the main content should be hidden
        if (
          event.url === '/login' ||
          event.url === '/create-user' ||
          event.url === '/upload' ||
          event.url === '/posts' ||
          event.url === '/new'
        ) {
          this.isHiddenPage = true;
        } else {
          this.isHiddenPage = false;
        }
      });
  }

  /**
   * Called when the HeaderComponent emits a categorySelected event.
   * @param category The category selected by the user.
   */
  onCategorySelect(category: string): void {
    this.selectedCategory = category;
  }
}
