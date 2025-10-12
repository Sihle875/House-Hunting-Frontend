import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Property, PropertySearchRequest, PropertyService } from '../services/property.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  contactForm: FormGroup;
  featuredProperties: Property[] = [];
  isLoadingProperties = false;
  isSubmittingContact = false;
  currentSlide = 0;
  contactSuccessMessage = '';
  contactErrorMessage = '';

  propertyTypes = ['Apartment', 'House', 'Studio', 'Room'];
  priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Under R5,000', value: '0-5000' },
    { label: 'R5,000 - R10,000', value: '5000-10000' },
    { label: 'R10,000 - R15,000', value: '10000-15000' },
    { label: 'R15,000+', value: '15000-999999' }
  ];

  bedroomOptions = [
    { label: 'Any', value: '' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' }
  ];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      location: ['', Validators.required],
      propertyType: [''],
      priceRange: [''],
      bedrooms: ['']
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFeaturedProperties();
    this.startCarouselAutoplay();
  }

  loadFeaturedProperties(): void {
    this.isLoadingProperties = true;
    this.propertyService.getFeaturedProperties().subscribe({
      next: (response) => {
        this.featuredProperties = response.data || [];
        this.isLoadingProperties = false;
      },
      error: (error) => {
        console.error('Error loading featured properties:', error);
        this.isLoadingProperties = false;
        // Load mock data for demonstration
        this.loadMockProperties();
      }
    });
  }

  loadMockProperties(): void {
    this.featuredProperties = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        description: 'Spacious 2-bedroom apartment in the heart of the city',
        price: 8500,
        location: 'Cape Town CBD',
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        available: true
      },
      {
        id: 2,
        title: 'Cozy Studio Near Campus',
        description: 'Perfect for students, close to all amenities',
        price: 4500,
        location: 'Observatory',
        bedrooms: 1,
        bathrooms: 1,
        propertyType: 'Studio',
        imageUrl: 'https://images.unsplash.com/photo-1502672260066-6bc35f0fc36d?w=800',
        available: true
      },
      {
        id: 3,
        title: 'Luxury Family Home',
        description: 'Beautiful 4-bedroom house with garden and pool',
        price: 18000,
        location: 'Constantia',
        bedrooms: 4,
        bathrooms: 3,
        propertyType: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        available: true
      }
    ];
  }

  searchProperties(): void {
    if (this.searchForm.valid) {
      const searchCriteria: PropertySearchRequest = {
        location: this.searchForm.value.location,
        propertyType: this.searchForm.value.propertyType || undefined,
        minPrice: this.getPriceRangeMin(this.searchForm.value.priceRange),
        maxPrice: this.getPriceRangeMax(this.searchForm.value.priceRange),
        minBedrooms: this.searchForm.value.bedrooms ? parseInt(this.searchForm.value.bedrooms) : undefined
      };

      // Navigate to search results page with query params
      this.router.navigate(['/properties'], { 
        queryParams: searchCriteria 
      });
    }
  }

  submitContactForm(): void {
    if (this.contactForm.valid) {
      this.isSubmittingContact = true;
      this.clearContactMessages();

      this.propertyService.submitContactForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.isSubmittingContact = false;
          this.contactSuccessMessage = 'Thank you! We will get back to you soon.';
          this.contactForm.reset();
        },
        error: (error) => {
          this.isSubmittingContact = false;
          this.contactErrorMessage = 'Failed to send message. Please try again.';
          console.error('Contact form error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredProperties.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredProperties.length - 1 
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  startCarouselAutoplay(): void {
    setInterval(() => {
      if (this.featuredProperties.length > 0) {
        this.nextSlide();
      }
    }, 5000);
  }

  viewPropertyDetails(propertyId: number): void {
    this.router.navigate(['/properties', propertyId]);
  }

  private getPriceRangeMin(range: string): number | undefined {
    if (!range) return undefined;
    return parseInt(range.split('-')[0]);
  }

  private getPriceRangeMax(range: string): number | undefined {
    if (!range) return undefined;
    return parseInt(range.split('-')[1]);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private clearContactMessages(): void {
    this.contactSuccessMessage = '';
    this.contactErrorMessage = '';
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}