// src/app/owner-dashboard/owner-dashboard.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AvailableCountPipe, UnavailableCountPipe } from '../pipes/property-count.pipe';
import { Property, PropertyService } from '../services/property.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvailableCountPipe, UnavailableCountPipe],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent implements OnInit {

  properties: Property[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Modal state
  showModal = false;
  isEditing = false;
  editingId: number | null = null;
  isSubmitting = false;

  // Confirm delete
  showDeleteConfirm = false;
  deletingId: number | null = null;

  propertyForm!: FormGroup;

  propertyTypes = ['Apartment', 'House', 'Studio', 'Room', 'Townhouse', 'Penthouse'];
  amenityOptions = ['WiFi', 'Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
                    'Laundry', 'Fireplace', 'Pet Friendly', 'Ocean View', 'Mountain View'];
  selectedAmenities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadMyProperties();
  }

  private buildForm(): void {
    this.propertyForm = this.fb.group({
      title:        ['', [Validators.required, Validators.minLength(5)]],
      description:  ['', [Validators.required, Validators.minLength(20)]],
      price:        [null, [Validators.required, Validators.min(1)]],
      location:     ['', Validators.required],
      bedrooms:     [1,   [Validators.required, Validators.min(0)]],
      bathrooms:    [1,   [Validators.required, Validators.min(0)]],
      propertyType: ['', Validators.required],
      imageUrl:     [''],
      squareMeters: [null],
      parkingSpaces:[0,   Validators.min(0)],
      furnished:    [false],
      petsAllowed:  [false],
      available:    [true]
    });
  }

  loadMyProperties(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.propertyService.getMyProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load properties';
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.selectedAmenities = [];
    this.propertyForm.reset({ bedrooms: 1, bathrooms: 1, parkingSpaces: 0, furnished: false, petsAllowed: false, available: true });
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(property: Property): void {
    this.isEditing = true;
    this.editingId = property.id;
    this.selectedAmenities = property.amenities ? [...property.amenities] : [];
    this.propertyForm.patchValue({
      title:        property.title,
      description:  property.description,
      price:        property.price,
      location:     property.location,
      bedrooms:     property.bedrooms,
      bathrooms:    property.bathrooms,
      propertyType: property.propertyType,
      imageUrl:     property.imageUrl || '',
      squareMeters: property.squareMeters || null,
      parkingSpaces:property.parkingSpaces || 0,
      furnished:    property.furnished || false,
      petsAllowed:  property.petsAllowed || false,
      available:    property.available
    });
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.editingId = null;
  }

  toggleAmenity(amenity: string): void {
    const idx = this.selectedAmenities.indexOf(amenity);
    if (idx >= 0) {
      this.selectedAmenities.splice(idx, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  submitProperty(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const payload = {
      ...this.propertyForm.value,
      amenities: this.selectedAmenities
    };

    const request$ = this.isEditing && this.editingId != null
      ? this.propertyService.updateProperty(this.editingId, payload)
      : this.propertyService.createProperty(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = this.isEditing
          ? 'Property updated successfully!'
          : 'Property listed successfully!';
        this.closeModal();
        this.loadMyProperties();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Something went wrong. Please try again.';
      }
    });
  }

  confirmDelete(id: number): void {
    this.deletingId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.deletingId = null;
    this.showDeleteConfirm = false;
  }

  deleteProperty(): void {
    if (this.deletingId == null) return;
    this.propertyService.deleteProperty(this.deletingId).subscribe({
      next: () => {
        this.successMessage = 'Property deleted.';
        this.showDeleteConfirm = false;
        this.deletingId = null;
        this.loadMyProperties();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete property.';
        this.showDeleteConfirm = false;
      }
    });
  }

  toggleAvailability(property: Property): void {
    this.propertyService.toggleAvailability(property.id).subscribe({
      next: (updated) => {
        const idx = this.properties.findIndex(p => p.id === updated.id);
        if (idx >= 0) this.properties[idx] = updated;
        this.successMessage = `Property marked as ${updated.available ? 'available' : 'unavailable'}.`;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update availability.';
      }
    });
  }

  viewProperty(id: number): void {
    this.router.navigate(['/properties', id]);
  }

  isFieldInvalid(field: string): boolean {
    const c = this.propertyForm.get(field);
    return !!(c && c.invalid && c.touched);
  }

  getFieldError(field: string): string {
    const c = this.propertyForm.get(field);
    if (c?.errors && c.touched) {
      if (c.errors['required'])  return `${this.labelFor(field)} is required`;
      if (c.errors['min'])       return `${this.labelFor(field)} must be at least ${c.errors['min'].min}`;
      if (c.errors['minlength']) return `${this.labelFor(field)} must be at least ${c.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private labelFor(field: string): string {
    const map: Record<string, string> = {
      title: 'Title', description: 'Description', price: 'Price',
      location: 'Location', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms',
      propertyType: 'Property type'
    };
    return map[field] ?? field;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  logout(): void {
    this.authService.logout();
  }
}
