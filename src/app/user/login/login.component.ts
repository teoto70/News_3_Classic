import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { catchError } from "rxjs";

@Component({
  selector: "app-login",
  imports: [FormsModule, NgIf],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router) {}

  login(form: NgForm) {
    const user = {
      email: form.value.email,
      password: form.value.password,
    };

    this.userService.login(user.email, user.password).subscribe({
      next: () => {
        this.router.navigate(["/home"]);
      },
      error: (error) => {
        console.error('Error during login:', error);
        throw new Error('Login failed');
      }
    });
  }
}
