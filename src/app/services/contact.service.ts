import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';


//interface for contact form data
export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Api response interface
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Mock API call to submit contact form
  submitContactForm(contactData: ContactRequest): Observable<ContactApiResponse> {
    
    // Simulating network delay and response
    return of({
      success: true,
      message: 'Thank you! Your message has been sent successfully!',
      data: contactData
    }).pipe(
      delay(2000), // Simulate network delay
    );
  }

  // Real API call would look like this:
    /*
    return this.http.post<ContactApiResponse>(`${this.apiUrl}/contact`, contactData)
      .pipe(
        catchError(this.handleError)
      );
    */

  // Error handling for real API calls
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if(error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('ContactService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
