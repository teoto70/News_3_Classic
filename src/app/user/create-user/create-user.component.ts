import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms"; // ✅ Import FormsModule
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [FormsModule, NgIf], // ✅ Ensure FormsModule is in the imports array
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"],
})
export class CreateUserComponent {
  error = "";
  successMessage = "";

  constructor(private userService: UserService, private router: Router) {}

  async createUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { email, username, password, pfp } = form.value;

    try {
    
      console.log("User successfully registered and saved to Firestore.");

      this.successMessage = "Registration successful! Redirecting...";
      
      // ✅ Redirect user to home after 2 seconds
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2000);

      form.reset(); // ✅ Reset form on success
    } catch (err: any) {
      this.error = "Error occurred during registration.";
      this.successMessage = ""; // Reset success message on error

      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            this.error = "The email address is already in use.";
            break;
          case "auth/invalid-email":
            this.error = "The email address is not valid.";
            break;
          case "auth/weak-password":
            this.error = "The password is too weak.";
            break;
          default:
            this.error = err.message;
            break;
        }
      }
      console.error("Registration error:", err);
    }
  }
}
