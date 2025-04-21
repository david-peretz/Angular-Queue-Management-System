import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-container">
      <div class="logo">
        <a routerLink="/">מערכת תורים</a>
      </div>
      
      <nav class="main-nav">
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">בית</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/appointments" routerLinkActive="active">התורים שלי</a></li>
          <li *ngIf="isLoggedIn && isStaffOrAdmin"><a routerLink="/management" routerLinkActive="active">ניהול</a></li>
        </ul>
      </nav>
      
      <div class="user-actions">
        <div *ngIf="isLoggedIn" class="user-info">
          <span class="user-greeting">שלום, {{currentUser?.firstName}}</span>
          <button class="btn-logout" (click)="logout()">התנתק</button>
        </div>
        <div *ngIf="!isLoggedIn" class="auth-actions">
          <a routerLink="/login" class="btn-login">התחברות</a>
          <a routerLink="/register" class="btn-register">הרשמה</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-700);
      text-decoration: none;
    }
    
    .main-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .main-nav li {
      margin: 0 1rem;
    }
    
    .main-nav a {
      color: var(--neutral-700);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.2s;
    }
    
    .main-nav a:hover {
      color: var(--primary-600);
    }
    
    .main-nav a.active {
      color: var(--primary-600);
    }
    
    .main-nav a.active:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 3px;
      background-color: var(--primary-600);
      border-radius: 3px;
    }
    
    .user-actions {
      display: flex;
      align-items: center;
    }
    
    .user-greeting {
      margin-left: 1rem;
      font-weight: 500;
    }
    
    .btn-logout {
      background: none;
      border: none;
      color: var(--error);
      font-weight: 500;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .btn-logout:hover {
      text-decoration: underline;
    }
    
    .auth-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-login, .btn-register {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .btn-login {
      color: var(--primary-600);
    }
    
    .btn-login:hover {
      background-color: var(--primary-50);
    }
    
    .btn-register {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn-register:hover {
      background-color: var(--primary-700);
    }
    
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        padding: 1rem;
      }
      
      .logo {
        margin-bottom: 1rem;
      }
      
      .main-nav {
        width: 100%;
        margin: 0.5rem 0;
      }
      
      .main-nav ul {
        justify-content: center;
      }
      
      .user-actions {
        width: 100%;
        justify-content: center;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isStaffOrAdmin = false;
  currentUser: UserModel | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isAuthenticated;
      this.currentUser = state.user;
      
      if (this.currentUser) {
        this.isStaffOrAdmin = ['staff', 'admin', 'branch-manager'].includes(this.currentUser.role);
      } else {
        this.isStaffOrAdmin = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}