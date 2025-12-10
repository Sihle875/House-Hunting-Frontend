// src/app/app.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './models/auth.models';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <h1 (click)="navigateHome()">🏠 House Hunting Platform</h1>
          <nav class="nav-links">
            <button 
              class="nav-btn" 
              (click)="navigateTo('/home')"
              [class.active]="isCurrentRoute('/home')"
            >
              Home
            </button>

            <!-- Show when not authenticated -->
            <ng-container *ngIf="!(isAuthenticated$ | async)">
              <button 
                class="nav-btn" 
                (click)="navigateTo('/sign-in')"
                [class.active]="isCurrentRoute('/sign-in')"
              >
                Sign In
              </button>
              <button 
                class="nav-btn" 
                (click)="navigateTo('/sign-up')"
                [class.active]="isCurrentRoute('/sign-up')"
              >
                Sign Up
              </button>
            </ng-container>

            <!-- Show when authenticated -->
            <ng-container *ngIf="isAuthenticated$ | async">
              <button 
                class="nav-btn" 
                (click)="navigateTo('/dashboard')"
                [class.active]="isCurrentRoute('/dashboard')"
              >
                Dashboard
              </button>
              <button 
                class="nav-btn" 
                (click)="navigateTo('/profile')"
                [class.active]="isCurrentRoute('/profile')"
              >
                Profile
              </button>
              
              <!-- Show admin link for admins only -->
              <button 
                *ngIf="hasRole('ROLE_ADMIN')"
                class="nav-btn" 
                (click)="navigateTo('/admin')"
                [class.active]="isCurrentRoute('/admin')"
              >
                Admin
              </button>
            </ng-container>

            <button 
              class="nav-btn" 
              (click)="navigateTo('/contact')"
              [class.active]="isCurrentRoute('/contact')"
            >
              Contact Us
            </button>

            <!-- Logout button when authenticated -->
            <button 
              *ngIf="isAuthenticated$ | async"
              class="nav-btn logout-btn" 
              (click)="logout()"
            >
              Logout
            </button>

            <!-- User info -->
            <div *ngIf="currentUser$ | async as user" class="user-info">
              <span class="user-name">{{ user.name }}</span>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
      box-sizing: border-box;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .app-header h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .app-header h1:hover {
      color: #667eea;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-btn {
      background: none;
      border: 1px solid #667eea;
      color: #667eea;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-btn:hover {
      background: #667eea;
      color: white;
    }

    .nav-btn.active {
      background: #667eea;
      color: white;
    }

    .logout-btn {
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .logout-btn:hover {
      background: #e74c3c;
      color: white;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .user-name {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .main-content {
      margin-top: 70px;
      flex: 1;
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .app-header h1 {
        font-size: 1.25rem;
      }
      
      .nav-links {
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
      
      .main-content {
        margin-top: 150px;
      }

      .user-info {
        padding: 0.4rem 0.8rem;
      }

      .user-name {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .header-content {
        gap: 0.8rem;
      }
      
      .nav-btn {
        padding: 0.35rem 0.7rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'househunting-frontend';
  isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}