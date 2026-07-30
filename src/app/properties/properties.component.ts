// src/app/properties/properties.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Property, PropertySearchRequest, PropertyService } from '../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent implements OnInit {

  properties: Property[] = [];
  isLoading = false;
  errorMessage = '';
  resultCount: number | null = null;

  searchForm!: FormGroup;
  showFilters = false;

  propertyTypes = ['Apartment', 'House', 'Studio', 'Room', 'Townhouse', 'Penthouse'];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      location:     [''],
      propertyType: [''],
      minPrice:     [null],
      maxPrice:     [null],
      minBedrooms:  [null],
      furnished:    [null],
      petsAllowed:  [null],
      available:    [true]
    });
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.propertyService.getAllProperties().subscribe({
      next: (list) => {
        this.properties = list;
        this.resultCount = list.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load properties.';
        this.isLoading = false;
      }
    });
  }

  search(): void {
    const v = this.searchForm.value;
    const criteria: PropertySearchRequest = {};

    if (v.location)     criteria.location     = v.location;
    if (v.propertyType) criteria.propertyType  = v.propertyType;
    if (v.minPrice)     criteria.minPrice      = +v.minPrice;
    if (v.maxPrice)     criteria.maxPrice      = +v.maxPrice;
    if (v.minBedrooms)  criteria.minBedrooms   = +v.minBedrooms;
    if (v.furnished  !== null && v.furnished  !== '') criteria.furnished   = v.furnished  === 'true';
    if (v.petsAllowed !== null && v.petsAllowed !== '') criteria.petsAllowed = v.petsAllowed === 'true';
    if (v.available  !== null && v.available  !== '') criteria.available   = v.available  === 'true' || v.available === true;

    this.isLoading = true;
    this.errorMessage = '';
    this.propertyService.searchProperties(criteria).subscribe({
      next: (list) => {
        this.properties = list;
        this.resultCount = list.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Search failed.';
        this.isLoading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchForm.reset({ available: true });
    this.loadAll();
  }

  viewProperty(id: number): void {
    this.router.navigate(['/properties', id]);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
