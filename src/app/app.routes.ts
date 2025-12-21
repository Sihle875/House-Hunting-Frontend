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
    // Protected routes example
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
  /*{
    path: 'my-properties',
    loadComponent: () => import('./my-properties/my-properties.component').then(m => m.MyPropertiesComponent),
    canActivate: [authGuard]
  },
  /*{
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },*/
  /*{
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },*/
  {
    path: '**',
    redirectTo: '/home'
  }
];