import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpRequest, UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  userForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm() {
    if(this.userForm.valid) {
      this.isLoading = true
      this.clearMessage();

      const userData: Omit<SignUpRequest, 'id'> = this.userForm.value

      this.userService.registerUser(userData)
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.successMessage = response.message || 'User registered successfully';
          this.userForm.reset();
          console.log('User has been created', response);
        },
        error: error => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Registration failed. Please try again';
          console.error('Error occured', error)
        }
      });
      
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field =  this.userForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.capitalizeFirst(fieldName)} must be at least ${field.errors['minlength'].requierdLength} characters`;
      }
    }
    return '';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessage() {
    this.successMessage = '';
    this.errorMessage = '';
  }

    // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
