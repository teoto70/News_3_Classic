import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  selector: "app-create-user",
  imports: [FormsModule, NgIf],
  templateUrl: "./create-user.component.html",
  styleUrl: "./create-user.component.css",
})
export class CreateUserComponent {
  error = "";

  constructor(private userService: UserService) {}

  createUser(form: NgForm) {
    const userData = {
      email: form.value.email,
      username: form.value.username,
      password: form.value.password,
      pfp: form.value.pfp,
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        console.log("User created");
      },
      error: (err: any) => {
        this.error = 'Error occurred during registration';
        if (err.code) {
          switch (err.code) {
            case 'auth/email-already-in-use':
              this.error =
                'The email address is already in use by another account.';
              break;
            case 'auth/invalid-email':
              this.error = 'The email address is not valid.';
              break;
            case 'auth/operation-not-allowed':
              this.error = 'Operation not allowed. Please contact support.';
              break;
            case 'auth/weak-password':
              this.error = 'The password is too weak.';
              break;
            default:
              this.error = err.message;
              break;
          }
        }
      }
    });
  }

  login(form: NgForm) {
    const user = {
      email: form.value.email,
      password: form.value.password,
    };

    this.userService.login(user.email, user.password).subscribe(() => {
      console.log("User logged in");
    });
  }
}
