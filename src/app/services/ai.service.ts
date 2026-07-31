// src/app/services/ai.service.ts

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DescriptionRequest {
  title: string;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters?: number | null;
  furnished?: boolean;
  petsAllowed?: boolean;
  amenities?: string[];
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateDescription(req: DescriptionRequest): Observable<{ description: string }> {
    return this.http
      .post<{ description: string }>(`${this.apiUrl}/ai/generate-description`, req)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message ?? `Error ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
