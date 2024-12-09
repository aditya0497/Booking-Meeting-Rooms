import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: string = '';

  public password: string = '';

  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  public login(): void {
    if (this.username.trim() === '') {
      this.errorMessage = 'Username is required.';
      return;
    }
  
    if (this.password === '') {
      this.errorMessage = 'Password is required.';
      return;
    }
  
    // Call AuthService to log in the user
    this.authService.login(this.username).subscribe(
      (success) => {
        if (success) {
          // Redirect to the dashboard
          localStorage.setItem('currentUser', this.username);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }  
}
