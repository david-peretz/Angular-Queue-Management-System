import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentModel, AppointmentStatus } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentCardComponent } from '../../components/appointment-card/appointment-card.component';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentCardComponent],
  template: `
    <div class="appointments-container">
      <div class="appointments-header">
        <h1 class="page-title">התורים שלי</h1>
        <a routerLink="/new-appointment" class="btn btn-primary">
          <i class="fas fa-plus"></i> תור חדש
        </a>
      </div>
      
      <div class="appointments-filters">
        <div class="filters-group">
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'all'"
            (click)="filterAppointments('all')"
          >
            כל התורים
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'upcoming'"
            (click)="filterAppointments('upcoming')"
          >
            תורים עתידיים
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'past'"
            (click)="filterAppointments('past')"
          >
            תורים קודמים
          </button>
        </div>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="loading" class="loading-container">
        <div class="loader"></div>
        <p>טוען תורים...</p>
      </div>
      
      <!-- No appointments state -->
      <div *ngIf="!loading && filteredAppointments.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-calendar-times"></i>
        </div>
        <h3>אין תורים להצגה</h3>
        <p>לא נמצאו תורים העונים לקריטריוני החיפוש.</p>
        <a routerLink="/new-appointment" class="btn btn-primary">קבע תור חדש</a>
      </div>
      
      <!-- Appointments list -->
      <div *ngIf="!loading && filteredAppointments.length > 0" class="appointments-list">
        <app-appointment-card
          *ngFor="let appointment of filteredAppointments"
          [appointment]="appointment"
          [userRole]="userRole"
          (onCancel)="cancelAppointment($event)"
          (onReschedule)="rescheduleAppointment($event)"
          (onComplete)="completeAppointment($event)"
        ></app-appointment-card>
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
    .appointments-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
      position: relative;
    }
    
    .appointments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .page-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--neutral-800);
      margin: 0;
    }
    
    .appointments-filters {
      margin-bottom: 1.5rem;
    }
    
    .filters-group {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    
    .filter-btn {
      padding: 0.5rem 1rem;
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-300);
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--neutral-700);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    
    .filter-btn:hover {
      background-color: var(--neutral-200);
    }
    
    .filter-btn.active {
      background-color: var(--primary-100);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 0;
    }
    
    .loader {
      width: 40px;
      height: 40px;
      border: 3px solid var(--neutral-200);
      border-radius: 50%;
      border-top-color: var(--primary-500);
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .empty-icon {
      font-size: 3rem;
      color: var(--neutral-400);
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--neutral-800);
    }
    
    .empty-state p {
      color: var(--neutral-600);
      margin-bottom: 1.5rem;
    }
    
    .appointments-list {
      display: grid;
      gap: 1rem;
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
      .appointments-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .page-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: AppointmentModel[] = [];
  filteredAppointments: AppointmentModel[] = [];
  
  loading = true;
  activeFilter = 'upcoming';
  userRole: UserRole = UserRole.CUSTOMER;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user role
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userRole = currentUser.role;
    
    // Load appointments
    this.appointmentService.getUserAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.filterAppointments(this.activeFilter);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
        this.errorMessage = 'אירעה שגיאה בטעינת התורים. אנא נסה שוב מאוחר יותר.';
      }
    });
  }

  filterAppointments(filter: string): void {
    this.activeFilter = filter;
    
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        this.filteredAppointments = this.appointments.filter(apt => 
          new Date(apt.scheduledTime) > now && 
          [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(apt.status)
        );
        break;
      
      case 'past':
        this.filteredAppointments = this.appointments.filter(apt => 
          new Date(apt.scheduledTime) < now || 
          [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW].includes(apt.status)
        );
        break;
      
      case 'all':
      default:
        this.filteredAppointments = [...this.appointments];
        break;
    }
    
    // Sort by date, most recent first for past appointments, soonest first for upcoming
    this.filteredAppointments.sort((a, b) => {
      if (filter === 'past') {
        return new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime();
      } else {
        return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
      }
    });
  }

  cancelAppointment(id: string): void {
    if (confirm('האם אתה בטוח שברצונך לבטל את התור?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: (appointment) => {
          // Update the appointment in the list
          const index = this.appointments.findIndex(apt => apt.id === id);
          if (index !== -1) {
            this.appointments[index] = appointment;
          }
          
          // Reapply current filter
          this.filterAppointments(this.activeFilter);
          
          // Show success message
          this.successMessage = 'התור בוטל בהצלחה';
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.errorMessage = 'אירעה שגיאה בביטול התור. אנא נסה שוב מאוחר יותר.';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  rescheduleAppointment(id: string): void {
    // In a real app, this would open a modal or navigate to a rescheduling page
    // Here we'll navigate to a hypothetical page
    this.router.navigate(['/reschedule'], { queryParams: { id } });
  }

  completeAppointment(id: string): void {
    this.appointmentService.updateAppointmentStatus(id, AppointmentStatus.COMPLETED).subscribe({
      next: (appointment) => {
        // Update the appointment in the list
        const index = this.appointments.findIndex(apt => apt.id === id);
        if (index !== -1) {
          this.appointments[index] = appointment;
        }
        
        // Reapply current filter
        this.filterAppointments(this.activeFilter);
        
        // Show success message
        this.successMessage = 'התור הושלם בהצלחה';
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        console.error('Error completing appointment:', error);
        this.errorMessage = 'אירעה שגיאה בעדכון סטטוס התור. אנא נסה שוב מאוחר יותר.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}