import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentModel, AppointmentStatus } from '../../models/appointment.model';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appointment-card" [ngClass]="getStatusClass()">
      <div class="card-header">
        <h3>{{ appointment.serviceType }}</h3>
        <span class="status-badge" [ngClass]="'status-' + appointment.status">
          {{ getStatusText(appointment.status) }}
        </span>
      </div>
      
      <div class="card-body">
        <div class="detail-row">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ appointment.branchName }}</span>
        </div>
        
        <div class="detail-row">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ formatDate(appointment.scheduledTime) }}</span>
        </div>
        
        <div class="detail-row">
          <i class="fas fa-clock"></i>
          <span>{{ formatTime(appointment.scheduledTime) }}</span>
        </div>
        
        <div class="detail-row">
          <i class="fas fa-hourglass-half"></i>
          <span>{{ appointment.estimatedDuration }} דקות</span>
        </div>
        
        <div *ngIf="appointment.notes" class="notes">
          <i class="fas fa-sticky-note"></i>
          <span>{{ appointment.notes }}</span>
        </div>
      </div>
      
      <div class="card-actions">
        <button 
          *ngIf="canCancel()" 
          class="btn-action btn-cancel" 
          (click)="onCancel.emit(appointment.id)"
        >
          <i class="fas fa-times"></i> ביטול תור
        </button>
        
        <button 
          *ngIf="canReschedule()" 
          class="btn-action btn-reschedule" 
          (click)="onReschedule.emit(appointment.id)"
        >
          <i class="fas fa-calendar-alt"></i> שינוי מועד
        </button>
        
        <button 
          *ngIf="canComplete()" 
          class="btn-action btn-complete" 
          (click)="onComplete.emit(appointment.id)"
        >
          <i class="fas fa-check"></i> סיום תור
        </button>
      </div>
    </div>
  `,
  styles: [`
    .appointment-card {
      border-radius: 8px;
      padding: 1.25rem;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-right: 5px solid transparent;
    }
    
    .appointment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .card-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--neutral-800);
      margin: 0;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    
    .detail-row i {
      width: 20px;
      color: var(--neutral-500);
      margin-left: 0.75rem;
    }
    
    .notes {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px dashed var(--neutral-200);
      display: flex;
      align-items: flex-start;
    }
    
    .notes i {
      width: 20px;
      color: var(--neutral-500);
      margin-left: 0.75rem;
      margin-top: 3px;
    }
    
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--neutral-200);
    }
    
    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-action i {
      margin-left: 0.375rem;
    }
    
    .btn-cancel {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    
    .btn-cancel:hover {
      background-color: rgba(239, 68, 68, 0.2);
    }
    
    .btn-reschedule {
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--status-in-progress);
    }
    
    .btn-reschedule:hover {
      background-color: rgba(59, 130, 246, 0.2);
    }
    
    .btn-complete {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--status-confirmed);
    }
    
    .btn-complete:hover {
      background-color: rgba(16, 185, 129, 0.2);
    }
    
    /* Status styles */
    .appointment-card.status-pending {
      border-right-color: var(--status-pending);
    }
    
    .appointment-card.status-confirmed {
      border-right-color: var(--status-confirmed);
    }
    
    .appointment-card.status-in-progress {
      border-right-color: var(--status-in-progress);
    }
    
    .appointment-card.status-completed {
      border-right-color: var(--status-completed);
    }
    
    .appointment-card.status-cancelled {
      border-right-color: var(--status-cancelled);
      opacity: 0.8;
    }
    
    .appointment-card.status-no-show {
      border-right-color: var(--status-no-show);
      opacity: 0.8;
    }
  `]
})
export class AppointmentCardComponent {
  @Input() appointment!: AppointmentModel;
  @Input() userRole: UserRole = UserRole.CUSTOMER;
  
  @Output() onCancel = new EventEmitter<string>();
  @Output() onReschedule = new EventEmitter<string>();
  @Output() onComplete = new EventEmitter<string>();
  
  getStatusClass(): string {
    return `status-${this.appointment.status}`;
  }
  
  getStatusText(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING: return 'ממתין לאישור';
      case AppointmentStatus.CONFIRMED: return 'מאושר';
      case AppointmentStatus.IN_PROGRESS: return 'בטיפול';
      case AppointmentStatus.COMPLETED: return 'הושלם';
      case AppointmentStatus.CANCELLED: return 'בוטל';
      case AppointmentStatus.NO_SHOW: return 'לא הגיע';
      default: return status;
    }
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  canCancel(): boolean {
    return [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(this.appointment.status);
  }
  
  canReschedule(): boolean {
    return [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(this.appointment.status);
  }
  
  canComplete(): boolean {
    return this.appointment.status === AppointmentStatus.IN_PROGRESS && 
           [UserRole.STAFF, UserRole.ADMIN, UserRole.BRANCH_MANAGER].includes(this.userRole);
  }
}