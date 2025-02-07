
import { RouterOutlet } from '@angular/router';	
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '@angular/fire/auth'; // ✅ Use Firebase’s User type instead of custom one
@Component({
  standalone: true,
  selector: 'app-all-post',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css'
})
export class AllPostComponent implements OnInit {


  isLoggedIn: boolean = false;
  currentUser: User | null = null; // ✅ Ensure it's the Firebase User type

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user; // ✅ Assign Firebase User type
      this.isLoggedIn = !!user; // Convert user to boolean
      
      console.log('User detected in header:', user);
      console.log('isLoggedIn:', this.isLoggedIn);
    });
  }

  /**
   * ✅ Logs out the user and redirects to `/`.
   */
  async logout(): Promise<void> {
    await this.userService.logout(); // ✅ Ensure `logout()` is called correctly
    this.router.navigate(['/']); // Redirect to home after logout
  }

}
