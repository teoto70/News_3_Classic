import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '@angular/fire/auth'; // ✅ Use Firebase’s User type instead of custom one
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-new-post',
  imports: [CommonModule, RouterModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit{
  
  isLoggedIn: boolean = false;
  currentUser: User | null = null; // ✅ Ensure it's the Firebase User type
  permalink: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
   
  }

}
