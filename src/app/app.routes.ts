import { Routes } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'contact',
    component: ContactFormComponent
  },

  // ── Property browsing (public) ──────────────────────────
  {
    path: 'properties',
    loadComponent: () => import('./properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },

  // ── Authenticated user routes ───────────────────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'saved-properties',
    loadComponent: () => import('./saved-properties/saved-properties.component').then(m => m.SavedPropertiesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-inquiries',
    loadComponent: () => import('./my-inquiries/my-inquiries.component').then(m => m.MyInquiriesComponent),
    canActivate: [authGuard]
  },

  // ── Owner dashboard ─────────────────────────────────────
  {
    path: 'owner-dashboard',
    loadComponent: () => import('./owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent),
    canActivate: [authGuard]
  },

  // ── Utility ─────────────────────────────────────────────
  {
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
