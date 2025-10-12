import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  imageUrl: string;
  available: boolean;
  squareMeters?: number;
  furnished?: boolean;
  petsAllowed?: boolean;
  parkingSpaces?: number;
  amenities?: string[];
  ownerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertySearchRequest {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  furnished?: boolean;
  petsAllowed?: boolean;
  available?: boolean;
}

export interface ContactFormRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: number;
}

export interface PropertyApiResponse {
  success: boolean;
  message: string;
  data?: Property[];
}

export interface SinglePropertyApiResponse {
  success: boolean;
  message: string;
  data?: Property;
}

export interface ContactFormApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = environment.apiUrl;
  private useMockData = true; // Toggle this to switch between mock and real API

  // Mock data for development
  private mockProperties: Property[] = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      description: 'Spacious 2-bedroom apartment in the heart of the city with stunning views and modern amenities',
      price: 8500,
      location: 'Cape Town CBD',
      bedrooms: 2,
      bathrooms: 2,
      propertyType: 'Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      available: true,
      squareMeters: 85,
      furnished: true,
      petsAllowed: false,
      parkingSpaces: 1,
      amenities: ['WiFi', 'Gym', 'Pool', 'Security', '24/7 Concierge'],
      createdAt: new Date('2025-01-15')
    },
    {
      id: 2,
      title: 'Cozy Studio Near Campus',
      description: 'Perfect for students, close to all amenities, public transport, and university',
      price: 4500,
      location: 'Observatory',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Studio',
      imageUrl: 'https://images.unsplash.com/photo-1502672260066-6bc35f0fc36d?w=800',
      available: true,
      squareMeters: 45,
      furnished: true,
      petsAllowed: true,
      parkingSpaces: 0,
      amenities: ['WiFi', 'Laundry', 'Study Area'],
      createdAt: new Date('2025-01-20')
    },
    {
      id: 3,
      title: 'Luxury Family Home',
      description: 'Beautiful 4-bedroom house with garden, pool, and mountain views',
      price: 18000,
      location: 'Constantia',
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      available: true,
      squareMeters: 250,
      furnished: false,
      petsAllowed: true,
      parkingSpaces: 3,
      amenities: ['Garden', 'Pool', 'Garage', 'Security', 'Mountain View'],
      createdAt: new Date('2025-01-10')
    },
    {
      id: 4,
      title: 'Stylish Loft in Trendy Area',
      description: 'Open-plan loft with exposed brick, high ceilings, and industrial charm',
      price: 9500,
      location: 'Woodstock',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      available: true,
      squareMeters: 70,
      furnished: false,
      petsAllowed: true,
      parkingSpaces: 1,
      amenities: ['WiFi', 'Security', 'Rooftop Access', 'Art Studios'],
      createdAt: new Date('2025-01-25')
    },
    {
      id: 5,
      title: 'Beachfront Paradise',
      description: 'Wake up to ocean views in this stunning 3-bedroom beachfront apartment',
      price: 15000,
      location: 'Sea Point',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
      available: true,
      squareMeters: 120,
      furnished: true,
      petsAllowed: false,
      parkingSpaces: 2,
      amenities: ['Ocean View', 'Balcony', 'Pool', 'Gym', 'Security'],
      createdAt: new Date('2025-01-05')
    },
    {
      id: 6,
      title: 'Charming Cottage',
      description: 'Quaint 2-bedroom cottage with private garden in a quiet neighborhood',
      price: 7200,
      location: 'Rondebosch',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'House',
      imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800',
      available: true,
      squareMeters: 95,
      furnished: false,
      petsAllowed: true,
      parkingSpaces: 1,
      amenities: ['Garden', 'Fireplace', 'Pet Friendly'],
      createdAt: new Date('2025-01-18')
    },
    {
      id: 7,
      title: 'Executive Penthouse',
      description: 'Luxury penthouse with panoramic city views and premium finishes',
      price: 25000,
      location: 'Waterfront',
      bedrooms: 3,
      bathrooms: 3,
      propertyType: 'Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      available: true,
      squareMeters: 180,
      furnished: true,
      petsAllowed: false,
      parkingSpaces: 2,
      amenities: ['City View', 'Rooftop Terrace', 'Gym', 'Concierge', 'Wine Cellar'],
      createdAt: new Date('2025-01-12')
    },
    {
      id: 8,
      title: 'Student Accommodation',
      description: 'Affordable room in shared house, perfect for students',
      price: 3500,
      location: 'Mowbray',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Room',
      imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      available: true,
      squareMeters: 20,
      furnished: true,
      petsAllowed: false,
      parkingSpaces: 0,
      amenities: ['WiFi', 'Shared Kitchen', 'Study Room', 'Laundry'],
      createdAt: new Date('2025-01-22')
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get featured properties for the home page carousel
   */
  getFeaturedProperties(): Observable<PropertyApiResponse> {
    if (this.useMockData) {
      // Return first 6 properties as featured
      const featured = this.mockProperties.slice(0, 6);
      return of({
        success: true,
        message: 'Featured properties retrieved successfully',
        data: featured
      }).pipe(delay(500)); // Simulate network delay
    }

    return this.http.get<PropertyApiResponse>(`${this.apiUrl}/properties/featured`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Search properties based on criteria
   */
  searchProperties(criteria: PropertySearchRequest): Observable<PropertyApiResponse> {
    if (this.useMockData) {
      let filtered = [...this.mockProperties];

      // Apply filters
      if (criteria.location) {
        filtered = filtered.filter(p => 
          p.location.toLowerCase().includes(criteria.location!.toLowerCase())
        );
      }

      if (criteria.propertyType) {
        filtered = filtered.filter(p => 
          p.propertyType.toLowerCase() === criteria.propertyType!.toLowerCase()
        );
      }

      if (criteria.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= criteria.minPrice!);
      }

      if (criteria.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= criteria.maxPrice!);
      }

      if (criteria.minBedrooms !== undefined) {
        filtered = filtered.filter(p => p.bedrooms >= criteria.minBedrooms!);
      }

      if (criteria.maxBedrooms !== undefined) {
        filtered = filtered.filter(p => p.bedrooms <= criteria.maxBedrooms!);
      }

      if (criteria.minBathrooms !== undefined) {
        filtered = filtered.filter(p => p.bathrooms >= criteria.minBathrooms!);
      }

      if (criteria.maxBathrooms !== undefined) {
        filtered = filtered.filter(p => p.bathrooms <= criteria.maxBathrooms!);
      }

      if (criteria.furnished !== undefined) {
        filtered = filtered.filter(p => p.furnished === criteria.furnished);
      }

      if (criteria.petsAllowed !== undefined) {
        filtered = filtered.filter(p => p.petsAllowed === criteria.petsAllowed);
      }

      if (criteria.available !== undefined) {
        filtered = filtered.filter(p => p.available === criteria.available);
      }

      return of({
        success: true,
        message: `Found ${filtered.length} properties`,
        data: filtered
      }).pipe(delay(500));
    }

    let params = new HttpParams();
    if (criteria.location) params = params.set('location', criteria.location);
    if (criteria.propertyType) params = params.set('propertyType', criteria.propertyType);
    if (criteria.minPrice !== undefined) params = params.set('minPrice', criteria.minPrice.toString());
    if (criteria.maxPrice !== undefined) params = params.set('maxPrice', criteria.maxPrice.toString());
    if (criteria.minBedrooms !== undefined) params = params.set('minBedrooms', criteria.minBedrooms.toString());
    if (criteria.maxBedrooms !== undefined) params = params.set('maxBedrooms', criteria.maxBedrooms.toString());
    if (criteria.minBathrooms !== undefined) params = params.set('minBathrooms', criteria.minBathrooms.toString());
    if (criteria.maxBathrooms !== undefined) params = params.set('maxBathrooms', criteria.maxBathrooms.toString());
    if (criteria.furnished !== undefined) params = params.set('furnished', criteria.furnished.toString());
    if (criteria.petsAllowed !== undefined) params = params.set('petsAllowed', criteria.petsAllowed.toString());
    if (criteria.available !== undefined) params = params.set('available', criteria.available.toString());

    return this.http.get<PropertyApiResponse>(`${this.apiUrl}/properties/search`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all properties with optional pagination
   */
  getAllProperties(page: number = 0, size: number = 10): Observable<PropertyApiResponse> {
    if (this.useMockData) {
      const start = page * size;
      const end = start + size;
      const paginatedData = this.mockProperties.slice(start, end);

      return of({
        success: true,
        message: 'Properties retrieved successfully',
        data: paginatedData
      }).pipe(delay(500));
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PropertyApiResponse>(`${this.apiUrl}/properties`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a single property by ID
   */
  getPropertyById(id: number): Observable<SinglePropertyApiResponse> {
    if (this.useMockData) {
      const property = this.mockProperties.find(p => p.id === id);
      
      if (property) {
        return of({
          success: true,
          message: 'Property retrieved successfully',
          data: property
        }).pipe(delay(500));
      } else {
        return throwError(() => new Error('Property not found'));
      }
    }

    return this.http.get<SinglePropertyApiResponse>(`${this.apiUrl}/properties/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get properties by owner ID (for landlord dashboard)
   */
  getPropertiesByOwner(ownerId: number): Observable<PropertyApiResponse> {
    if (this.useMockData) {
      const ownerProperties = this.mockProperties.filter(p => p.ownerId === ownerId);
      
      return of({
        success: true,
        message: 'Owner properties retrieved successfully',
        data: ownerProperties
      }).pipe(delay(500));
    }

    return this.http.get<PropertyApiResponse>(`${this.apiUrl}/properties/owner/${ownerId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new property listing (for landlords)
   */
  createProperty(propertyData: Omit<Property, 'id'>): Observable<SinglePropertyApiResponse> {
    if (this.useMockData) {
      const newProperty: Property = {
        ...propertyData,
        id: this.mockProperties.length + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.mockProperties.push(newProperty);

      return of({
        success: true,
        message: 'Property created successfully',
        data: newProperty
      }).pipe(delay(500));
    }

    return this.http.post<SinglePropertyApiResponse>(`${this.apiUrl}/properties`, propertyData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing property
   */
  updateProperty(id: number, propertyData: Partial<Property>): Observable<SinglePropertyApiResponse> {
    if (this.useMockData) {
      const index = this.mockProperties.findIndex(p => p.id === id);
      
      if (index !== -1) {
        this.mockProperties[index] = {
          ...this.mockProperties[index],
          ...propertyData,
          updatedAt: new Date()
        };

        return of({
          success: true,
          message: 'Property updated successfully',
          data: this.mockProperties[index]
        }).pipe(delay(500));
      } else {
        return throwError(() => new Error('Property not found'));
      }
    }

    return this.http.put<SinglePropertyApiResponse>(`${this.apiUrl}/properties/${id}`, propertyData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a property listing
   */
  deleteProperty(id: number): Observable<ContactFormApiResponse> {
    if (this.useMockData) {
      const index = this.mockProperties.findIndex(p => p.id === id);
      
      if (index !== -1) {
        this.mockProperties.splice(index, 1);
        
        return of({
          success: true,
          message: 'Property deleted successfully'
        }).pipe(delay(500));
      } else {
        return throwError(() => new Error('Property not found'));
      }
    }

    return this.http.delete<ContactFormApiResponse>(`${this.apiUrl}/properties/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Submit contact form
   */
  submitContactForm(formData: ContactFormRequest): Observable<ContactFormApiResponse> {
    if (this.useMockData) {
      console.log('Contact form submitted (MOCK):', formData);
      
      return of({
        success: true,
        message: 'Thank you! We will get back to you soon.'
      }).pipe(delay(1000));
    }

    return this.http.post<ContactFormApiResponse>(`${this.apiUrl}/contact`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Contact property owner about a specific property
   */
  contactPropertyOwner(propertyId: number, formData: ContactFormRequest): Observable<ContactFormApiResponse> {
    if (this.useMockData) {
      console.log('Property owner contacted (MOCK):', { propertyId, formData });
      
      return of({
        success: true,
        message: 'Your message has been sent to the property owner'
      }).pipe(delay(1000));
    }

    return this.http.post<ContactFormApiResponse>(
      `${this.apiUrl}/properties/${propertyId}/contact`, 
      formData
    ).pipe(catchError(this.handleError));
  }

  /**
   * Mark property as favorite (requires authentication)
   */
  toggleFavorite(propertyId: number): Observable<ContactFormApiResponse> {
    if (this.useMockData) {
      console.log('Favorite toggled (MOCK):', propertyId);
      
      return of({
        success: true,
        message: 'Favorite status updated'
      }).pipe(delay(500));
    }

    return this.http.post<ContactFormApiResponse>(`${this.apiUrl}/properties/${propertyId}/favorite`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Get user's favorite properties (requires authentication)
   */
  getFavoriteProperties(): Observable<PropertyApiResponse> {
    if (this.useMockData) {
      // Return random properties as favorites
      const favorites = this.mockProperties.slice(0, 3);
      
      return of({
        success: true,
        message: 'Favorite properties retrieved successfully',
        data: favorites
      }).pipe(delay(500));
    }

    return this.http.get<PropertyApiResponse>(`${this.apiUrl}/properties/favorites`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  /**
 * Handle HTTP errors safely (works in SSR & browser)
 */
private handleError(error: any): Observable<never> {
  let errorMessage = 'An unknown error occurred';

  // Handle Angular HTTP errors
  if (error instanceof HttpErrorResponse) {
    if (typeof error.error === 'object' && error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  } else if (error && typeof error.message === 'string') {
    // Handle generic JS errors
    errorMessage = error.message;
  }

  console.error('PropertyService Error:', errorMessage);
  return throwError(() => new Error(errorMessage));
}


  /**
   * Toggle between mock and real API
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  /**
   * Get current mock data status
   */
  isUsingMockData(): boolean {
    return this.useMockData;
  }
}