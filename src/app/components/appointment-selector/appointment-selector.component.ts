import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchModel } from '../../models/branch.model';
import { ServiceModel } from '../../models/service.model';
import { BranchService } from '../../services/branch.service';
import { ServiceService } from '../../services/service.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentCreateModel } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="appointment-selector">
      <h2 class="selector-title">קביעת תור חדש</h2>
      
      <form [formGroup]="appointmentForm" (ngSubmit)="submitForm()">
        <!-- Branch selection -->
        <div class="form-group">
          <label for="branch" class="form-label">בחר סניף:</label>
          <select 
            id="branch" 
            formControlName="branchId" 
            class="form-control"
            (change)="onBranchChange()"
          >
            <option value="" disabled>בחר סניף</option>
            <option *ngFor="let branch of branches" [value]="branch.id">
              {{ branch.name }} - {{ branch.address }}
            </option>
          </select>
          <div class="error-message" *ngIf="submitted && f['branchId'].errors">
            יש לבחור סניף
          </div>
        </div>
        
        <!-- Service selection -->
        <div class="form-group" *ngIf="f['branchId'].value">
          <label class="form-label">בחר שירות:</label>
          <div class="search-box">
            <input 
              type="text" 
              placeholder="חפש שירות..." 
              class="form-control search-input"
              (input)="filterServices($event)"
            >
            <i class="fas fa-search search-icon"></i>
          </div>
          
          <div class="services-grid">
            <div 
              *ngFor="let service of filteredServices" 
              class="service-card"
              [class.selected]="f['serviceId'].value === service.id"
              (click)="selectService(service.id)"
            >
              <h4>{{ service.name }}</h4>
              <p>{{ service.description }}</p>
              <span class="service-duration">
                <i class="fas fa-clock"></i> {{ service.defaultDuration }} דקות
              </span>
            </div>
          </div>
          <div class="error-message" *ngIf="submitted && f['serviceId'].errors">
            יש לבחור שירות
          </div>
        </div>
        
        <!-- Date selection -->
        <div class="form-group" *ngIf="f['serviceId'].value">
          <label for="date" class="form-label">בחר תאריך:</label>
          <input 
            type="date" 
            id="date" 
            formControlName="date" 
            class="form-control" 
            [min]="minDate"
            (change)="onDateChange()"
          >
          <div class="error-message" *ngIf="submitted && f['date'].errors">
            יש לבחור תאריך תקין
          </div>
        </div>
        
        <!-- Time slots -->
        <div class="form-group" *ngIf="availableSlots.length > 0">
          <label class="form-label">בחר שעה:</label>
          <div class="time-slots">
            <button 
              type="button"
              *ngFor="let slot of availableSlots" 
              class="time-slot-btn"
              [class.selected]="f['time'].value === slot"
              (click)="selectTimeSlot(slot)"
            >
              {{ slot }}
            </button>
          </div>
          <div class="error-message" *ngIf="submitted && f['time'].errors">
            יש לבחור שעה
          </div>
        </div>
        
        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="form-label">הערות:</label>
          <textarea 
            id="notes" 
            formControlName="notes" 
            class="form-control" 
            rows="3"
            placeholder="הוסף הערות או בקשות מיוחדות..."
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="resetForm()">
            <i class="fas fa-undo"></i> נקה
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-calendar-check"></i> קבע תור
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .appointment-selector {
      padding: 1.5rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .selector-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--neutral-800);
      position: relative;
      padding-bottom: 0.5rem;
    }
    
    .selector-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 3px;
      background-color: var(--primary-500);
      border-radius: 3px;
    }
    
    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }
    
    .search-input {
      padding-right: 2.5rem;
    }
    
    .search-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--neutral-400);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .service-card {
      border: 1px solid var(--neutral-200);
      border-radius: 6px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .service-card:hover {
      border-color: var(--primary-400);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }
    
    .service-card.selected {
      border-color: var(--primary-500);
      background-color: rgba(99, 102, 241, 0.05);
    }
    
    .service-card h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--neutral-800);
    }
    
    .service-card p {
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin-bottom: 0.75rem;
    }
    
    .service-duration {
      font-size: 0.875rem;
      color: var(--neutral-500);
      display: flex;
      align-items: center;
    }
    
    .service-duration i {
      margin-left: 0.375rem;
    }
    
    .time-slots {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .time-slot-btn {
      background: var(--neutral-100);
      border: 1px solid var(--neutral-300);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .time-slot-btn:hover {
      background: var(--neutral-200);
      border-color: var(--neutral-400);
    }
    
    .time-slot-btn.selected {
      background: var(--primary-600);
      color: white;
      border-color: var(--primary-600);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .form-actions button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AppointmentSelectorComponent implements OnInit {
  @Output() createAppointment = new EventEmitter<AppointmentCreateModel>();
  
  appointmentForm: FormGroup;
  branches: BranchModel[] = [];
  services: ServiceModel[] = [];
  filteredServices: ServiceModel[] = [];
  availableSlots: string[] = [];
  submitted: boolean = false;
  minDate: string;
  
  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService
  ) {
    // Set minimum date (today)
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    // Create form
    this.appointmentForm = this.fb.group({
      branchId: ['', Validators.required],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }
  
  ngOnInit(): void {
    // Load branches
    this.branchService.getActiveBranches().subscribe(branches => {
      this.branches = branches;
    });
    
    // Load services
    this.serviceService.getActiveServices().subscribe(services => {
      this.services = services;
    });
  }
  
  get f() {
    return this.appointmentForm.controls;
  }
  
  onBranchChange(): void {
    // Reset service and time when branch changes
    this.appointmentForm.patchValue({
      serviceId: '',
      date: '',
      time: ''
    });
    
    this.availableSlots = [];
    
    // Filter services for the selected branch
    const branchId = this.f['branchId'].value;
    if (branchId) {
      this.branchService.getBranchById(branchId).subscribe(branch => {
        if (branch) {
          // Get available service IDs for this branch
          const serviceIds = branch.services.map(s => s.serviceId);
          
          // Filter services
          this.filteredServices = this.services.filter(service => 
            serviceIds.includes(service.id) && service.isActive
          );
        }
      });
    } else {
      this.filteredServices = [];
    }
  }
  
  filterServices(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    
    if (!searchTerm) {
      // If no search term, show all available services for this branch
      this.onBranchChange();
      return;
    }
    
    // Filter based on search term
    this.filteredServices = this.filteredServices.filter(
      service => service.name.toLowerCase().includes(searchTerm) || 
                service.description.toLowerCase().includes(searchTerm)
    );
  }
  
  selectService(serviceId: string): void {
    this.appointmentForm.patchValue({ serviceId });
    
    // Clear date and time when service changes
    this.appointmentForm.patchValue({
      date: '',
      time: ''
    });
    
    this.availableSlots = [];
  }
  
  onDateChange(): void {
    if (this.f['branchId'].value && this.f['serviceId'].value && this.f['date'].value) {
      this.generateAvailableTimeSlots();
    }
  }
  
  selectTimeSlot(time: string): void {
    this.appointmentForm.patchValue({ time });
  }
  
  generateAvailableTimeSlots(): void {
    const branchId = this.f['branchId'].value;
    const serviceId = this.f['serviceId'].value;
    const date = this.f['date'].value;
    
    if (branchId && serviceId && date) {
      this.appointmentService.getAvailableTimeSlots(branchId, serviceId, date)
        .subscribe(slots => {
          this.availableSlots = slots;
          this.appointmentForm.patchValue({ time: '' });
        });
    }
  }
  
  resetForm(): void {
    this.appointmentForm.reset();
    this.availableSlots = [];
    this.submitted = false;
  }
  
  submitForm(): void {
    this.submitted = true;
    
    if (this.appointmentForm.invalid) {
      return;
    }
    
    const formData = this.appointmentForm.value;
    
    // Create full appointment data
    const appointmentData: AppointmentCreateModel = {
      branchId: formData.branchId,
      serviceId: formData.serviceId,
      scheduledTime: this.combineDateTime(formData.date, formData.time),
      notes: formData.notes || ''
    };
    
    this.createAppointment.emit(appointmentData);
    this.resetForm();
  }
  
  combineDateTime(date: string, time: string): Date {
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(Number(hours), Number(minutes));
    return dateTime;
  }
}