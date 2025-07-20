import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerUser(userData: Omit<User, 'id'>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, userData)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`
    }

    console.error('UserService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
