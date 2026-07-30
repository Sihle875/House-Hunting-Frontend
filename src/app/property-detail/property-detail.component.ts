// src/app/property-detail/property-detail.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Property, PropertyService } from '../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit {

  property: Property | null = null;
  isLoading = true;
  errorMessage = '';

  // Enquiry form
  enquiryForm!: FormGroup;
  isSendingEnquiry = false;
  enquirySent = false;
  enquiryError = '';

  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    this.enquiryForm = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', [Validators.required, Validators.pattern('^(\\+27|0)[0-9]{9}$')]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });

    // Pre-fill if logged in
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.enquiryForm.patchValue({
          name:  `${user.name} ${user.surname}`.trim(),
          email: user.email,
          phone: user.phoneNumber || ''
        });
      }
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.errorMessage = 'Invalid property ID.';
      this.isLoading = false;
      return;
    }

    this.propertyService.getPropertyById(id).subscribe({
      next: (prop) => {
        this.property = prop;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Property not found.';
        this.isLoading = false;
      }
    });
  }

  sendEnquiry(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }

    this.isSendingEnquiry = true;
    this.enquiryError = '';

    const payload = {
      ...this.enquiryForm.value,
      propertyId: this.property?.id
    };

    this.propertyService.submitContactForm(payload).subscribe({
      next: () => {
        this.isSendingEnquiry = false;
        this.enquirySent = true;
      },
      error: (err) => {
        this.isSendingEnquiry = false;
        this.enquiryError = err.message || 'Failed to send enquiry. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }

  isFieldInvalid(field: string): boolean {
    const c = this.enquiryForm.get(field);
    return !!(c && c.invalid && c.touched);
  }

  getFieldError(field: string): string {
    const c = this.enquiryForm.get(field);
    if (c?.errors && c.touched) {
      if (c.errors['required'])    return `${this.label(field)} is required`;
      if (c.errors['email'])       return 'Please enter a valid email address';
      if (c.errors['pattern'])     return 'Please enter a valid SA phone number (e.g. 0812345678)';
      if (c.errors['minlength'])   return `Message must be at least ${c.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private label(field: string): string {
    const map: Record<string, string> = { name: 'Name', email: 'Email', phone: 'Phone', message: 'Message' };
    return map[field] ?? field;
  }
}
