import { Component, OnInit } from "@angular/core";
import { UserService } from "../../user/user.service";
import { User } from "../../types/user";


@Component({
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = user ? true : false;
      console.log("User:", user);
      
    });
  
  }
}
