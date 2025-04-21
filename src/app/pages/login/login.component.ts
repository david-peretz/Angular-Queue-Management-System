import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">התחברות למערכת</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email" class="form-label">דואר אלקטרוני</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control"
              placeholder="your&#64;email.com"
              [ngClass]="{'invalid': submitted && f['email'].errors}"
            >
            <div class="error-message" *ngIf="submitted && f['email'].errors">
              <span *ngIf="f['email'].errors['required']">יש להזין דואר אלקטרוני</span>
              <span *ngIf="f['email'].errors['email']">יש להזין כתובת דואר אלקטרוני תקינה</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">סיסמה</label>
            <div class="password-field">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                class="form-control"
                placeholder="הזן סיסמה"
                [ngClass]="{'invalid': submitted && f['password'].errors}"
              >
              <button 
                type="button"
                class="password-toggle" 
                (click)="togglePasswordVisibility()"
              >
                <i class="fas" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <div class="error-message" *ngIf="submitted && f['password'].errors">
              <span *ngIf="f['password'].errors['required']">יש להזין סיסמה</span>
              <span *ngIf="f['password'].errors['minlength']">הסיסמה חייבת להכיל לפחות 6 תווים</span>
            </div>
          </div>
          
          <div class="error-message auth-error" *ngIf="authError">
            {{ authError }}
          </div>
          
          <div class="form-action">
            <button 
              type="submit" 
              class="btn-submit" 
              [disabled]="loading"
            >
              <span *ngIf="!loading">התחברות</span>
              <span *ngIf="loading" class="loader"></span>
            </button>
          </div>
          
          <div class="auth-links">
            <a routerLink="/forgot-password" class="forgot-link">שכחת סיסמה?</a>
            <span class="auth-divider"></span>
            <span>אין לך חשבון? <a routerLink="/register" class="register-link">הירשם עכשיו</a></span>
          </div>
          
          <div class="demo-accounts">
            <h4>חשבונות לדוגמה:</h4>
            <div class="demo-account" (click)="fillDemoAccount('admin')">
              <strong>מנהל:</strong> admin&#64;example.com / admin123
            </div>
            <div class="demo-account" (click)="fillDemoAccount('customer')">
              <strong>לקוח:</strong> customer&#64;example.com / customer123
            </div>
            <div class="demo-account" (click)="fillDemoAccount('staff')">
              <strong>עובד:</strong> staff&#64;example.com / staff123
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 300px);
      padding: 2rem 1rem;
    }
    
    .auth-card {
      width: 100%;
      max-width: 450px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .auth-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--neutral-800);
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-300);
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    
    .form-control.invalid {
      border-color: var(--error);
    }
    
    .password-field {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--neutral-500);
      cursor: pointer;
      padding: 0.25rem;
    }
    
    .password-toggle:hover {
      color: var(--neutral-700);
    }
    
    .error-message {
      color: var(--error);
      font-size: 0.875rem;
      margin-top: 0.375rem;
    }
    
    .auth-error {
      text-align: center;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 4px;
    }
    
    .form-action {
      margin-top: 1.5rem;
    }
    
    .btn-submit {
      width: 100%;
      padding: 0.875rem;
      background-color: var(--primary-600);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .btn-submit:hover {
      background-color: var(--primary-700);
    }
    
    .btn-submit:disabled {
      background-color: var(--neutral-400);
      cursor: not-allowed;
    }
    
    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.875rem;
    }
    
    .forgot-link, .register-link {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .forgot-link:hover, .register-link:hover {
      text-decoration: underline;
    }
    
    .auth-divider {
      display: block;
      height: 1px;
      background-color: var(--neutral-200);
      margin: 1rem 0;
    }
    
    .demo-accounts {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--neutral-300);
    }
    
    .demo-accounts h4 {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--neutral-600);
    }
    
    .demo-account {
      font-size: 0.8125rem;
      background-color: var(--neutral-100);
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .demo-account:hover {
      background-color: var(--neutral-200);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  authError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { 
    return this.loginForm.controls; 
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.authError = '';
    
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.authError = error.message || 'התחברות נכשלה. אנא נסו שוב.';
          this.loading = false;
        }
      });
  }

  fillDemoAccount(type: string): void {
    switch(type) {
      case 'admin':
        this.loginForm.patchValue({
          email: 'admin@example.com',
          password: 'admin123'
        });
        break;
      case 'customer':
        this.loginForm.patchValue({
          email: 'customer@example.com',
          password: 'customer123'
        });
        break;
      case 'staff':
        this.loginForm.patchValue({
          email: 'staff@example.com',
          password: 'staff123'
        });
        break;
    }
  }
}