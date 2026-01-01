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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'househunting-frontend';
  isMobileMenuOpen = false;
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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}