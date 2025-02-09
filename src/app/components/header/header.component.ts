import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  categoriesList: string[] = ['All', 'News', 'Sports', 'Tech', 'Business'];
  isMenuOpen: boolean = false;
  
  constructor(private router: Router) {}

  onSelect(category: string): void {
    console.log('Selected category:', category);
    // Navigate to the main route with the selected category as a route parameter.
    this.router.navigate(['/main', category]);
    this.isMenuOpen = false; // close menu after selection
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
