import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(public auth: Auth, private firestore: Firestore) {
    // ✅ Listen for Firebase authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      console.log("Auth state changed:", user);
      this.currentUserSubject.next(user);
    });
  }

  /**
   * ✅ Logs in a user using Firebase Authentication.
   */
  async loginUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUserSubject.next(userCredential.user);
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * ✅ Logs out the user from Firebase Authentication.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}
