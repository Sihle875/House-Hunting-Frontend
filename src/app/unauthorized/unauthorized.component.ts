// src/app/unauthorized/unauthorized.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="unauth-wrapper">
      <div class="unauth-card">
        <div class="unauth-icon">🔒</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <div class="unauth-actions">
          <button class="btn-home" (click)="goHome()">Go Home</button>
          <button class="btn-login" (click)="goLogin()">Sign In</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauth-wrapper {
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .unauth-card {
      background: white;
      border-radius: 14px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.2);
    }
    .unauth-icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 1.75rem; color: #222; margin: 0 0 0.75rem; }
    p  { color: #666; margin-bottom: 2rem; }
    .unauth-actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-home {
      padding: 0.7rem 1.75rem;
      border: 2px solid #667eea;
      border-radius: 8px;
      background: white;
      color: #667eea;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-home:hover { background: #667eea; color: white; }
    .btn-login {
      padding: 0.7rem 1.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-login:hover { opacity: 0.88; }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}
  goHome():  void { this.router.navigate(['/home']); }
  goLogin(): void { this.router.navigate(['/sign-in']); }
}
