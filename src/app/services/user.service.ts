import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SignUpRequest {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpApiResponse {
  success: boolean;
  message: string;
  data?: any
}

export interface SignInApiResponse {
  success: boolean;
  message: string;
  user?: SignInRequest;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerUser(userData: Omit<SignUpRequest, 'id'>): Observable<SignUpApiResponse> {
    return this.http.post<SignUpApiResponse>(`${this.apiUrl}/register`, userData)
    .pipe(
      catchError(this.handleError)
    );
  }

  signInUser(creditials: SignInRequest): Observable<SignInApiResponse> {
    return this.http.post<SignInApiResponse>(`${this.apiUrl}/login`, creditials)
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
