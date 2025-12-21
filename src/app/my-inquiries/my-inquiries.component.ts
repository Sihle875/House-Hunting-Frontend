// src/app/my-inquiries/my-inquiries.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-inquiries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inquiries-container">
      <div class="container">
        <div class="coming-soon-card">
          <div class="icon">📧</div>
          <h1>My Inquiries</h1>
          <p>This feature is coming soon! You'll be able to track all your property inquiries and applications here.</p>
          <div class="features-list">
            <div class="feature-item">
              <span class="check">✓</span>
              <span>View all sent inquiries</span>
            </div>
            <div class="feature-item">
              <span class="check">✓</span>
              <span>Track inquiry status</span>
            </div>
            <div class="feature-item">
              <span class="check">✓</span>
              <span>Get landlord responses</span>
            </div>
            <div class="feature-item">
              <span class="check">✓</span>
              <span>Manage application documents</span>
            </div>
            <div class="feature-item">
              <span class="check">✓</span>
              <span>Schedule property viewings</span>
            </div>
          </div>
          <div class="button-group">
            <button class="btn-primary" (click)="browseProperties()">Browse Properties</button>
            <button class="btn-secondary" (click)="goBack()">Back to Profile</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inquiries-container {
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .container {
      max-width: 600px;
      width: 100%;
    }

    .coming-soon-card {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    h1 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .features-list {
      text-align: left;
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      color: #555;
    }

    .check {
      color: #28a745;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #f8f9fa;
    }

    @media (max-width: 480px) {
      .coming-soon-card {
        padding: 2rem 1.5rem;
      }

      .button-group {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class MyInquiriesComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  browseProperties(): void {
    this.router.navigate(['/home']);
  }
}