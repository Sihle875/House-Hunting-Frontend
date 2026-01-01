import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Property, PropertyService } from '../services/property.service';
import { UserRecordDTO, UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: 'users' | 'properties' = 'users';
  
  users: UserRecordDTO[] = [];
  properties: Property[] = [];
  
  isLoadingUsers = false;
  isLoadingProperties = false;
  
  showUserModal = false;
  showPropertyModal = false;
  showDeleteConfirm = false;
  
  userForm: FormGroup;
  propertyForm: FormGroup;
  
  editingUser: UserRecordDTO | null = null;
  editingProperty: Property | null = null;
  deletingItem: { type: 'user' | 'property', id: number } | null = null;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.minLength(6)]]
    });

    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: ['', [Validators.required, Validators.min(0)]],
      propertyType: ['', Validators.required],
      imageUrl: ['', Validators.required],
      squareMeters: ['', Validators.min(0)],
      furnished: [false],
      petsAllowed: [false],
      parkingSpaces: [0, Validators.min(0)],
      available: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProperties();
  }

  switchTab(tab: 'users' | 'properties'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response || [];
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoadingUsers = false;
      }
    });
    
    
    /* Mock data for demonstration
    setTimeout(() => {
      this.users = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          password: '******',
          createdAt: new Date('2025-01-15')
        },
        {
          id: 2,
          name: 'Jane',
          surname: 'Smith',
          email: 'jane@example.com',
          password: '******',
          createdAt: new Date('2025-01-20')
        },
        {
          id: 3,
          name: 'Mike',
          surname: 'Johnson',
          email: 'mike@example.com',
          password: '******',
          createdAt: new Date('2025-01-22')
        }
      ];
      this.isLoadingUsers = false;
    }, 500);*/
  }

  loadProperties(): void {
    this.isLoadingProperties = true;
    this.propertyService.getAllProperties().subscribe({
      next: (response) => {
        this.properties = response.data || [];
        this.isLoadingProperties = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.errorMessage = 'Failed to load properties';
        this.isLoadingProperties = false;
      }
    });
  }

  openUserModal(user?: UserRecordDTO): void {
    this.editingUser = user || null;
    
    if (user) {
      this.userForm.patchValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: ''
      });
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset();
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
    this.userForm.reset();
    this.clearMessages();
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.editingUser) {
        // Update user
        console.log('Updating user:', this.editingUser.id, userData);
        
        // When backend is ready, use:
        /*
        this.userService.updateUser(this.editingUser.id, userData).subscribe({
          next: (response) => {
            this.successMessage = response.message || 'User updated successfully';
            this.loadUsers();
            this.closeUserModal();
            setTimeout(() => this.clearMessages(), 3000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to update user';
          }
        });
        */
        
        // Mock update
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = { 
            ...this.users[index], 
            ...userData,
            password: userData.password || this.users[index].passsword
          };
        }
        this.successMessage = 'User updated successfully';
        this.closeUserModal();
        setTimeout(() => this.clearMessages(), 3000);
        
      } else {
        // Create new user
        this.authService.adminRegister(userData).subscribe({
          next: (response) => {
            console.log(response)
            
            this.loadUsers();
            this.closeUserModal();
            
            this.router.navigate(['/admin'])
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to create user';
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  openPropertyModal(property?: Property): void {
    this.editingProperty = property || null;
    
    if (property) {
      this.propertyForm.patchValue(property);
    } else {
      this.propertyForm.reset({
        furnished: false,
        petsAllowed: false,
        parkingSpaces: 0,
        available: true
      });
    }
    
    this.showPropertyModal = true;
  }

  closePropertyModal(): void {
    this.showPropertyModal = false;
    this.editingProperty = null;
    this.propertyForm.reset();
    this.clearMessages();
  }

  saveProperty(): void {
    if (this.propertyForm.valid) {
      const propertyData = this.propertyForm.value;
      
      if (this.editingProperty) {
        // Update property
        this.propertyService.updateProperty(this.editingProperty.id, propertyData).subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Property updated successfully';
            this.loadProperties();
            this.closePropertyModal();
            setTimeout(() => this.clearMessages(), 3000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to update property';
          }
        });
      } else {
        // Create new property
        this.propertyService.createProperty(propertyData).subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Property created successfully';
            this.loadProperties();
            this.closePropertyModal();
            setTimeout(() => this.clearMessages(), 3000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to create property';
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.propertyForm);
    }
  }

  confirmDelete(type: 'user' | 'property', id: number): void {
    this.deletingItem = { type, id };
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingItem = null;
  }

  executeDelete(): void {
    if (!this.deletingItem) return;
    
    const { type, id } = this.deletingItem;
    
    if (type === 'user') {
      this.userService.deleteAccount(id).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'User deleted successfully';
          this.loadUsers();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete user';
        }
      });
    
      
      // Mock delete
      console.log('Deleting user:', id);
      this.users = this.users.filter(u => u.id !== id);
      this.successMessage = 'User deleted successfully';
      setTimeout(() => this.clearMessages(), 3000);
      
    } else {
      // Delete property
      this.propertyService.deleteProperty(id).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Property deleted successfully';
          this.loadProperties();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete property';
        }
      });
    }
    
    this.showDeleteConfirm = false;
    this.deletingItem = null;
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalize(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Must be at least ${requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `Must be greater than or equal to ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
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

  logout(): void {
    // You can add any logout logic here (clear tokens, etc.)
    this.router.navigate(['/sign-in']);
  }
}