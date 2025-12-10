// src/app/dashboard/dashboard.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-card">
        <h1>Welcome to Your Dashboard</h1>
        
        <div *ngIf="currentUser$ | async as user" class="user-details">
          <h2>User Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Name:</label>
              <span>{{ user.name }} {{ user.surname }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ user.email }}</span>
            </div>
            <div class="info-item" *ngIf="user.roles && user.roles.length > 0">
              <label>Roles:</label>
              <span>{{ user.roles.join(', ') }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-content">
          <h2>Your Properties</h2>
          <p>View and manage your property listings here.</p>
          
          <div class="action-buttons">
            <button class="btn-primary">View Properties</button>
            <button class="btn-secondary">Add New Property</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    h2 {
      color: #667eea;
      margin-bottom: 1rem;
    }

    .user-details {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      gap: 1rem;
    }

    .info-item label {
      font-weight: 600;
      color: #555;
      min-width: 80px;
    }

    .info-item span {
      color: #333;
    }

    .dashboard-content {
      padding: 1.5rem 0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
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
      background: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-card {
        padding: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$!: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }
}