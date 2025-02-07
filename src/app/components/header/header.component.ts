import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  /**
   * List of categories for navigation.
   */
  categoriesList: string[] = ['All', 'News', 'Sports', 'Tech', 'Business'];

  /**
   * Emits the currently selected category to parent components.
   */
  @Output() categorySelected = new EventEmitter<string>();

  /**
   * Indicates whether a user is logged in.
   */
  isLoggedIn = false;

  /**
   * Holds the current logged-in user (Firebase User type).
   */
  currentUser: User | null = null;

  /**
   * Toggles the mobile hamburger menu.
   */
  isMenuOpen = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Subscribes to authentication state changes on initialization.
   */
  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;

      console.log('User detected in header:', user);
      console.log('isLoggedIn:', this.isLoggedIn);
    });
  }

  /**
   * Logs out the user and redirects to home.
   */
  async logout(): Promise<void> {
    await this.userService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Handles category selection and closes the hamburger menu (for mobile).
   */
  onSelect(category: string): void {
    console.log('Selected category:', category);
    this.categorySelected.emit(category);
    this.isMenuOpen = false; // Close menu after selecting a category
  }

  /**
   * Toggles the mobile menu open/close state.
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
