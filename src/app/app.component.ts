// src/app/app.component.ts

import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from './models/auth.models';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-shell">

      <!-- ── Header ──────────────────────────────────────────── -->
      <header class="header" [class.scrolled]="isScrolled">
        <div class="header-inner">

          <!-- Logo -->
          <button class="logo" (click)="go('/home')">
            <span class="logo-icon">🏠</span>
            <span class="logo-text">House<strong>Hunting</strong></span>
          </button>

          <!-- Desktop nav -->
          <nav class="desktop-nav">
            <button class="nav-link" [class.active]="activeRoute==='/home'" (click)="go('/home')">Home</button>
            <button class="nav-link" [class.active]="activeRoute==='/properties'" (click)="go('/properties')">Browse</button>
            <button class="nav-link" [class.active]="activeRoute==='/contact'" (click)="go('/contact')">Contact</button>

            <ng-container *ngIf="isAuthenticated$ | async; else guestNav">
              <button class="nav-link" [class.active]="activeRoute==='/owner-dashboard'" (click)="go('/owner-dashboard')">My Listings</button>
              <button class="nav-link" [class.active]="activeRoute==='/profile'" (click)="go('/profile')">Profile</button>
              <button *ngIf="hasRole('ADMIN')" class="nav-link" [class.active]="activeRoute==='/admin'" (click)="go('/admin')">Admin</button>

              <!-- User chip + logout -->
              <div class="user-chip" *ngIf="currentUser$ | async as user">
                <span class="user-avatar">{{ user.name.charAt(0) | uppercase }}</span>
                <span class="user-name-text">{{ user.name }}</span>
              </div>
              <button class="btn-logout" (click)="logout()">Sign Out</button>
            </ng-container>

            <ng-template #guestNav>
              <button class="btn-outline" (click)="go('/sign-in')">Sign In</button>
              <button class="btn-filled" (click)="go('/sign-up')">Get Started</button>
            </ng-template>
          </nav>

          <!-- Hamburger -->
          <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <!-- ── Mobile drawer ────────────────────────────────────── -->
      <div class="drawer-overlay" [class.visible]="menuOpen" (click)="closeMenu()"></div>
      <nav class="mobile-drawer" [class.open]="menuOpen">

        <div class="drawer-header">
          <span class="logo-text">🏠 House<strong>Hunting</strong></span>
          <button class="drawer-close" (click)="closeMenu()">✕</button>
        </div>

        <!-- User info -->
        <div class="drawer-user" *ngIf="currentUser$ | async as user">
          <div class="drawer-avatar">{{ user.name.charAt(0) | uppercase }}</div>
          <div>
            <p class="drawer-user-name">{{ user.name }} {{ user.surname }}</p>
            <p class="drawer-user-email">{{ user.email }}</p>
          </div>
        </div>

        <div class="drawer-links">
          <button class="drawer-link" (click)="go('/home')">🏠 Home</button>
          <button class="drawer-link" (click)="go('/properties')">🔍 Browse Properties</button>
          <button class="drawer-link" (click)="go('/contact')">✉️ Contact</button>

          <ng-container *ngIf="isAuthenticated$ | async; else guestDrawer">
            <div class="drawer-divider"></div>
            <button class="drawer-link" (click)="go('/owner-dashboard')">📋 My Listings</button>
            <button class="drawer-link" (click)="go('/profile')">👤 Profile</button>
            <button *ngIf="hasRole('ADMIN')" class="drawer-link" (click)="go('/admin')">⚙️ Admin</button>
            <div class="drawer-divider"></div>
            <button class="drawer-link drawer-logout" (click)="logout()">🚪 Sign Out</button>
          </ng-container>

          <ng-template #guestDrawer>
            <div class="drawer-divider"></div>
            <button class="drawer-link" (click)="go('/sign-in')">🔑 Sign In</button>
            <button class="drawer-link drawer-signup" (click)="go('/sign-up')">✨ Get Started</button>
          </ng-template>
        </div>
      </nav>

      <!-- ── Page content ─────────────────────────────────────── -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    /* ── Shell ─────────────────────────────────────────────── */
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ─────────────────────────────────────────────── */
    .header {
      position: fixed;
      inset: 0 0 auto 0;
      height: var(--header-h, 68px);
      z-index: 900;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid transparent;
      transition: border-color var(--transition), box-shadow var(--transition);
    }

    .header.scrolled {
      border-bottom-color: var(--border, #e1e4ed);
      box-shadow: 0 2px 16px rgba(108,92,231,.10);
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    /* ── Logo ───────────────────────────────────────────────── */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }

    .logo-icon { font-size: 1.5rem; line-height: 1; }

    .logo-text {
      font-size: 1.2rem;
      color: var(--text, #2d3436);
      letter-spacing: -0.3px;
    }

    .logo-text strong { color: var(--primary, #6C5CE7); font-weight: 700; }

    /* ── Desktop nav ────────────────────────────────────────── */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-link {
      background: none;
      border: none;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-muted, #636e72);
      transition: background var(--transition), color var(--transition);
      white-space: nowrap;
    }

    .nav-link:hover { background: #f0eeff; color: var(--primary, #6C5CE7); }
    .nav-link.active { background: #ede9ff; color: var(--primary, #6C5CE7); font-weight: 600; }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0eeff;
      border-radius: 20px;
      padding: 0.35rem 0.85rem 0.35rem 0.35rem;
      margin-left: 0.35rem;
    }

    .user-avatar {
      width: 28px; height: 28px;
      background: var(--primary, #6C5CE7);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700;
    }

    .user-name-text { font-size: 0.85rem; font-weight: 600; color: var(--primary, #6C5CE7); }

    .btn-outline {
      background: none;
      border: 1.5px solid var(--primary, #6C5CE7);
      color: var(--primary, #6C5CE7);
      padding: 0.45rem 1.1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      transition: all var(--transition);
      margin-left: 0.5rem;
    }

    .btn-outline:hover { background: var(--primary, #6C5CE7); color: white; }

    .btn-filled {
      background: var(--primary, #6C5CE7);
      border: none;
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      transition: background var(--transition), transform var(--transition);
      box-shadow: 0 3px 10px rgba(108,92,231,.3);
    }

    .btn-filled:hover { background: var(--primary-dark, #5a4bd1); transform: translateY(-1px); }

    .btn-logout {
      background: none;
      border: 1.5px solid #e17055;
      color: #e17055;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all var(--transition);
      margin-left: 0.25rem;
    }

    .btn-logout:hover { background: #e17055; color: white; }

    /* ── Hamburger ──────────────────────────────────────────── */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px; height: 40px;
      background: none;
      border: none;
      border-radius: 8px;
      padding: 6px;
      transition: background var(--transition);
      flex-shrink: 0;
    }

    .hamburger:hover { background: #f0eeff; }

    .hamburger span {
      display: block;
      width: 22px; height: 2px;
      background: var(--text, #2d3436);
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
      transform-origin: center;
    }

    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── Mobile drawer ──────────────────────────────────────── */
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 950;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(2px);
    }

    .drawer-overlay.visible { opacity: 1; pointer-events: all; }

    .mobile-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(320px, 88vw);
      background: white;
      z-index: 960;
      transform: translateX(100%);
      transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      box-shadow: -8px 0 32px rgba(0,0,0,.18);
      overflow-y: auto;
    }

    .mobile-drawer.open { transform: translateX(0); }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.25rem 1rem;
      border-bottom: 1px solid var(--border, #e1e4ed);
    }

    .drawer-header .logo-text { font-size: 1.1rem; }

    .drawer-close {
      background: #f5f5f5;
      border: none;
      width: 34px; height: 34px;
      border-radius: 50%;
      font-size: 0.9rem;
      color: #666;
      display: flex; align-items: center; justify-content: center;
      transition: background var(--transition);
    }

    .drawer-close:hover { background: #eee; }

    .drawer-user {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f0eeff, #e8e4ff);
      margin: 0.75rem;
      border-radius: 10px;
    }

    .drawer-avatar {
      width: 44px; height: 44px;
      background: var(--primary, #6C5CE7);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; font-weight: 700;
      flex-shrink: 0;
    }

    .drawer-user-name { font-weight: 700; font-size: 0.95rem; color: var(--text, #2d3436); }
    .drawer-user-email { font-size: 0.78rem; color: var(--text-muted, #636e72); margin-top: 2px; }

    .drawer-links {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0.75rem 1.5rem;
      flex: 1;
    }

    .drawer-link {
      background: none;
      border: none;
      text-align: left;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text, #2d3436);
      transition: background var(--transition), color var(--transition);
    }

    .drawer-link:hover { background: #f0eeff; color: var(--primary, #6C5CE7); }

    .drawer-divider {
      height: 1px;
      background: var(--border, #e1e4ed);
      margin: 0.5rem 0.5rem;
    }

    .drawer-logout { color: #e17055; }
    .drawer-logout:hover { background: #fff0ed; color: #c0392b; }

    .drawer-signup { color: var(--primary, #6C5CE7); font-weight: 600; }
    .drawer-signup:hover { background: #ede9ff; }

    /* ── Main content ───────────────────────────────────────── */
    .main-content {
      margin-top: var(--header-h, 68px);
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ── Responsive ─────────────────────────────────────────── */
    @media (max-width: 900px) {
      .desktop-nav { display: none; }
      .hamburger   { display: flex; }
    }

    @media (max-width: 480px) {
      .header-inner { padding: 0 1rem; }
      .logo-text    { font-size: 1.05rem; }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'househunting-frontend';
  isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<User | null>;
  isScrolled = false;
  menuOpen = false;
  activeRoute = '/home';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$     = this.authService.currentUser$;

    // Track active route for nav highlighting
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeRoute = e.urlAfterRedirects.split('?')[0];
        this.closeMenu();
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 12;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeMenu();
  }

  go(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void  { this.menuOpen = false; }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
