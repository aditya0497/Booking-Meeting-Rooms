import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isLoggedIn: boolean = false;
  
  private currentUser: string | null = null;

  /**
   * Mock login function
   * Simulates user authentication
   */
  public login(username: string): Observable<boolean> {
    if (username.trim()) {
      this.isLoggedIn = true;
      this.currentUser = username;
      localStorage.setItem('currentUser', username); // Persist user session in localStorage
      return of(true);
    }
    return of(false);
  }

  /**
   * Mock logout function
   * Simulates user logout
   */
  public logout(): void {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser'); // Clear session
  }
}
