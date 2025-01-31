import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { AdsAsideComponent } from './core/ads-aside/ads-aside.component';
import { SideNavbarComponent } from "./core/side-navbar/side-navbar.component";
import { LedDisplayComponent } from './led-display/led-display.component';
import { TopCreatorsComponent } from "./top-creators/top-creators.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AdsAsideComponent, SideNavbarComponent, LedDisplayComponent, TopCreatorsComponent, HeaderComponent, MainComponent],
  templateUrl: './app.component.html',
  template: `<app-led-display text="Scrolling LED Text in Angular 15+!"></app-led-display>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'news';

  isHiddenPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/creator/login' || this.router.url === '/admin/createUser') {
        this.isHiddenPage = true;
      } else {
        this.isHiddenPage = false;
      }
    });

}
}
