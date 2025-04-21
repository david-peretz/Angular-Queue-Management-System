import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentCreateModel } from '../../models/appointment.model';
import { AppointmentSelectorComponent } from '../../components/appointment-selector/appointment-selector.component';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentSelectorComponent],
  template: `
    <div class="new-appointment-container">
      <div class="appointment-header">
        <h1 class="page-title">קביעת תור חדש</h1>
        <p class="page-subtitle">בחר את הפרטים הרצויים לתור החדש שלך</p>
      </div>
      
      <div class="appointment-content">
        <app-appointment-selector
          (createAppointment)="onCreateAppointment($event)"
        ></app-appointment-selector>
      </div>
      
      <!-- Success notification -->
      <div *ngIf="successMessage" class="notification success">
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
        <button class="close-btn" (click)="successMessage = ''">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Error notification -->
      <div *ngIf="errorMessage" class="notification error">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
        <button class="close-btn" (click)="errorMessage = ''">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .new-appointment-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
      position: relative;
    }
    
    .appointment-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--neutral-800);
      margin-bottom: 0.5rem;
    }
    
    .page-subtitle {
      color: var(--neutral-600);
      font-size: 1.1rem;
    }
    
    .appointment-content {
      margin-bottom: 2rem;
    }
    
    .notification {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
      z-index: 1000;
    }
    
    .notification.success {
      background-color: var(--success);
      color: white;
    }
    
    .notification.error {
      background-color: var(--error);
      color: white;
    }
    
    .notification i {
      margin-left: 0.75rem;
    }
    
    .close-btn {
      margin-right: 0.75rem;
      background: none;
      border: none;
      color: white;
      opacity: 0.8;
      cursor: pointer;
    }
    
    .close-btn:hover {
      opacity: 1;
    }
    
    @keyframes slideUp {
      from { transform: translate(-50%, 100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }
      
      .page-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class NewAppointmentComponent implements OnInit {
  successMessage = '';
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/new-appointment' } 
      });
    }
    
    // Could handle query params for pre-selected branch, etc.
    this.route.queryParams.subscribe(params => {
      // Handle any query params, e.g., selected branch
      console.log('Route params:', params);
    });
  }

  onCreateAppointment(appointmentData: AppointmentCreateModel): void {
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (appointment) => {
        console.log('Appointment created:', appointment);
        this.successMessage = 'התור נקבע בהצלחה!';
        
        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this.errorMessage = 'אירעה שגיאה בקביעת התור. אנא נסה שוב מאוחר יותר.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}