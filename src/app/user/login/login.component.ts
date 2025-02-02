import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router"; // ✅ Import Router

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, NgIf], // ✅ Ensure FormsModule is imported
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  error = "";
  successMessage = ""; // ✅ Success message variable

  constructor(private userService: UserService, private router: Router) {}

  async loginUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { email, password } = form.value;

    try {
      await this.userService.loginUser(email, password);
      console.log("User logged in successfully.");

      // ✅ Show success message
      this.successMessage = "Login successful! Redirecting...";

      // ✅ Redirect user to home page (`/`) after 2 seconds
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2000);

      form.reset();
    } catch (err: any) {
      this.error = "Error occurred during login.";
      this.successMessage = ""; // Clear success message on error

      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
            this.error = "No account found with this email.";
            break;
          case "auth/wrong-password":
            this.error = "Incorrect password.";
            break;
          case "auth/invalid-email":
            this.error = "The email address is not valid.";
            break;
          default:
            this.error = err.message;
            break;
        }
      }
      console.error("Login error:", err);
    }
  }
}
