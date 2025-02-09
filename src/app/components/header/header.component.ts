import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categoriesList: string[] = ['All', 'News', 'Sports', 'Tech', 'Business'];
  isMenuOpen: boolean = false;
  
  // New properties for user authentication state
  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      console.log('User detected in header:', user);
      console.log('isLoggedIn:', this.isLoggedIn);
    });
  }

  onSelect(category: string): void {
    console.log('Selected category:', category);
    this.router.navigate(['/main', category]);
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
 // New logout method that calls the service's logout method
 logout(): void {
  this.userService.logout().then(() => {
    // Navigate to home (or another desired route) after logging out.
    this.router.navigate(['/']);
  }).catch(error => {
    console.error('Logout failed:', error);
  });
}
}
