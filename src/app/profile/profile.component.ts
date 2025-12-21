// src/app/profile/profile.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/auth.models';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  isEditMode = false;
  isLoadingProfile = false;
  isUpdating = false;
  isDeleting = false;
  isChangingPassword = false;
  
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';
  
  showDeleteConfirmation = false;
  deleteConfirmationText = '';
  
  showPasswordSection = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Stats for tenant/renter activities
  tenantStats = {
    savedProperties: 0,
    viewedProperties: 0,
    inquiriesSent: 0,
    activeApplications: 0
  };

  // Recent activities
  recentActivities = [
    // Placeholder data - will be replaced with real data from API
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    // Initialize profile form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(\+27|0)[0-9]{9}$/)]],
      bio: ['', [Validators.maxLength(500)]]
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Load current user profile
   */
  loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        surname: this.currentUser.surname,
        email: this.currentUser.email
      });
      
      // Email should not be editable
      this.profileForm.get('email')?.disable();
      
      this.isLoadingProfile = false;
      
      // Load tenant statistics and activities
      this.loadTenantStatistics();
      this.loadRecentActivities();
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  /**
   * Load tenant statistics
   */
  loadTenantStatistics(): void {
    // TODO: Implement actual API call to get tenant statistics
    this.tenantStats = {
      savedProperties: 0,
      viewedProperties: 0,
      inquiriesSent: 0,
      activeApplications: 0
    };
  }

  /**
   * Load recent activities
   */
  loadRecentActivities(): void {
    // TODO: Implement actual API call to get recent activities
    this.recentActivities = [];
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    if (this.isEditMode) {
      // Cancel editing - restore original values
      this.loadUserProfile();
    }
    this.isEditMode = !this.isEditMode;
    this.clearMessages();
  }

  /**
   * Toggle password section
   */
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.passwordForm.reset();
      this.clearPasswordMessages();
    }
  }

  /**
   * Update profile
   */
  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isUpdating = true;
      this.clearMessages();

      const updateData = {
        id: this.currentUser.id,
        name: this.profileForm.get('name')?.value,
        surname: this.profileForm.get('surname')?.value,
        email: this.currentUser.email,
        phone: this.profileForm.get('phone')?.value,
        bio: this.profileForm.get('bio')?.value
      };

      this.userService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.isUpdating = false;
          this.successMessage = 'Profile updated successfully!';
          
          // Update current user in auth service
          const updatedUser: User = {
            ...this.currentUser!,
            name: updateData.name,
            surname: updateData.surname
          };
          
          // Store updated user
          this.authService.updateCurrentUser(updatedUser);
          this.currentUser = updatedUser;
          
          this.isEditMode = false;
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isUpdating = false;
          this.errorMessage = error.message || 'Failed to update profile';
          console.error('Profile update error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  /**
   * Change password
   */
  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.clearPasswordMessages();

      const passwordData = {
        currentPassword: this.passwordForm.get('currentPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      };

      this.userService.changePassword(passwordData).subscribe({
        next: () => {
          this.isChangingPassword = false;
          this.passwordSuccessMessage = 'Password changed successfully!';
          this.passwordForm.reset();
          this.showPasswordSection = false;
          
          setTimeout(() => {
            this.passwordSuccessMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isChangingPassword = false;
          this.passwordErrorMessage = error.message || 'Failed to change password';
          console.error('Password change error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  /**
   * Show delete confirmation dialog
   */
  showDeleteDialog(): void {
    this.showDeleteConfirmation = true;
    this.deleteConfirmationText = '';
  }

  /**
   * Close delete confirmation dialog
   */
  closeDeleteDialog(): void {
    this.showDeleteConfirmation = false;
    this.deleteConfirmationText = '';
  }

  /**
   * Delete account
   */
  deleteAccount(): void {
    if (this.deleteConfirmationText.toLowerCase() !== 'delete' || !this.currentUser) {
      return;
    }

    this.isDeleting = true;

    this.userService.deleteAccount(this.currentUser.id).subscribe({
      next: () => {
        this.isDeleting = false;
        // Logout and redirect
        this.authService.logout();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isDeleting = false;
        this.errorMessage = error.message || 'Failed to delete account';
        this.closeDeleteDialog();
        console.error('Account deletion error:', error);
      }
    });
  }

  /**
   * Password match validator
   */
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Check if form field is invalid
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Get field error message
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.capitalizeFirst(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.capitalizeFirst(fieldName)} must not exceed ${maxLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number (+27XXXXXXXXX or 0XXXXXXXXX)';
      }
    }
    
    // Check for password mismatch
    if (fieldName === 'confirmPassword' && form.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field: string): void {
    switch(field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  /**
   * Navigate to saved properties
   */
  navigateToSavedProperties(): void {
    this.router.navigate(['/saved-properties']);
  }

  /**
   * Navigate to browse properties
   */
  /*browsePro properties(): void {
    this.router.navigate(['/home']);
  }*/

  /**
   * Navigate to my inquiries
   */
  navigateToInquiries(): void {
    this.router.navigate(['/my-inquiries']);
  }

  /**
   * Utility methods
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1').trim();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private clearPasswordMessages(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.name.charAt(0)}${this.currentUser.surname.charAt(0)}`.toUpperCase();
  }

  /**
   * Get member since date (placeholder)
   */
  getMemberSince(): string {
    // TODO: Get actual registration date from API
    return 'January 2025';
  }
}