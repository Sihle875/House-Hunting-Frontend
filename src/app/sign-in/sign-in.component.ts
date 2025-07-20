import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInRequest, UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm() {
    if (this.signInForm.valid) {
      this.isLoading = true;
      this.clearMessage();

      const creditials: SignInRequest = this.signInForm.value;

      this.userService.signInUser(creditials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Sign in successful!!!';
      
        console.log('User signed in successfully', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Sign in failed. Please try again.';
        console.error('Sign in error occurred', error);
      }
    });
  } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched();
    }
  }

    // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Navigate to sign up page
  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  // Helper method to check if a field has errors and is touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signInForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get specific field error
  getFieldError(fieldName: string): string {
    const field = this.signInForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Password must be at least ${requiredLength} characters long`;
      }
    }
    return '';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private markFormGroupTouched() {
    Object.keys(this.signInForm.controls).forEach(key => {
      const control = this.signInForm.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessage() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onForgotPassword() {
    // Implement forgot password logic here
    console.log('Forgot password clicked');
    // You can navigate to a forgot password page or show a modal
    // this.router.navigate(['/forgot-password']);
  }
}
